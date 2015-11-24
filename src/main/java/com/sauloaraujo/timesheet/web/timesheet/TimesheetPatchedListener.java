package com.sauloaraujo.timesheet.web.timesheet;

import com.sauloaraujo.timesheet.domain.timesheet.Timesheet;
import com.sauloaraujo.timesheet.domain.timesheet.TimesheetPatchedEvent;
import com.sauloaraujo.timesheet.web.configuration.WebSocketMessageBrokerConfigurer;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Component;

@Component
public class TimesheetPatchedListener implements ApplicationListener<TimesheetPatchedEvent> {

    @Autowired
    private MapperFacade mapper;

    @Autowired
    private SimpMessageSendingOperations template;

    @Override
    public void onApplicationEvent(TimesheetPatchedEvent event) {
        Timesheet timesheet = event.getTimesheet();
        TimesheetResource resource = mapper.map(timesheet, TimesheetResource.class);
        template.convertAndSend(WebSocketMessageBrokerConfigurer.TOPIC + "/timesheet/patch", resource);
        System.out.println(event);
    }
}
