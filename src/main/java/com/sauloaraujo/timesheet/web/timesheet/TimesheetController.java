package com.sauloaraujo.timesheet.web.timesheet;

import com.sauloaraujo.timesheet.domain.DateService;
import com.sauloaraujo.timesheet.domain.CalendarService;
import com.sauloaraujo.timesheet.domain.timesheet.Timesheet;
import com.sauloaraujo.timesheet.domain.timesheet.TimesheetService;
import com.sun.xml.internal.ws.api.streaming.XMLStreamReaderFactory;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*;
import org.springframework.web.bind.annotation.*;

import java.util.Calendar;
import java.util.Date;

/**
 * Created by deinf.rsoares on 12/11/2015.
 */


@RestController
@RequestMapping("/api/timesheets")
public class TimesheetController {

    private @Autowired
    TimesheetService service;

    private @Autowired
    MapperFacade mapper;

    private @Autowired
    DateService dateService;

    private @Autowired
    CalendarService calendarService;

    @RequestMapping(method = RequestMethod.GET, value="/today")
    public TimesheetResource get(
            @RequestParam(value="days", defaultValue="7") int days
    )
    {
        return get(dateService.midnight(),days);
    }

    @RequestMapping(method = RequestMethod.GET, value="/{start}")
    public TimesheetResource get(
            @PathVariable("start")
            @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) Date start,
            @RequestParam(value="days", defaultValue="7") int days
    )
    {
        TimesheetResource resource = mapper.map(service.get(start, days), TimesheetResource.class);
        resource.add(
                linkTo(
                        methodOn(getClass()).
                                patch(start, null)
                ).withRel("save")
            );

        resource.add(
                linkTo(
                        methodOn(getClass())
                                .get(start, days)
                ).withSelfRel()
        );

        Calendar c = calendarService.midnight(start);
        c.add(Calendar.DAY_OF_MONTH, days);
        resource.add(
                linkTo(
                        methodOn(getClass())
                                .get(c.getTime(), days)
                ).withRel("next")
        );

        c = calendarService.midnight(start);
        c.add(Calendar.DAY_OF_MONTH, -days);
        resource.add(
                linkTo(
                        methodOn(getClass())
                                .get(c.getTime(), days)
                ).withRel("previous")
        );

        if (days > 1)
            resource.add(
                linkTo(
                        methodOn(getClass())
                                .get(start, days - 1)
                ).withRel("minus")
        );

        resource.add(
                linkTo(
                        methodOn(getClass())
                                .get(start  , days+1)
                ).withRel("plus")
        );
        return resource;
    }

    @RequestMapping(method = RequestMethod.PATCH, value="/{start}")
    public Object patch(
            @PathVariable("start")
            @DateTimeFormat(iso=DateTimeFormat.ISO.DATE) Date start,
            @RequestBody TimesheetResource timesheetResource) {
        Timesheet timesheet = mapper.map(timesheetResource, Timesheet.class);

        service.patch(start,timesheet);
        return null;
    }
}
