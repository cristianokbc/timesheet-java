package com.sauloaraujo.timesheet.web;

import com.sauloaraujo.timesheet.web.project.ProjectController;
import com.sauloaraujo.timesheet.web.task.TaskController;
import com.sauloaraujo.timesheet.web.timesheet.TimesheetController;
import org.springframework.hateoas.ResourceSupport;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.methodOn;

@RestController
@RequestMapping("/api")
public class RootController {

    @RequestMapping(method = RequestMethod.GET)
    public ResourceSupport get() {
        ResourceSupport resource = new ResourceSupport();
        resource.add(linkTo(methodOn(getClass()).get()).withSelfRel());
        resource.add(linkTo(methodOn(TimesheetController.class).get(null, null)).withRel("timesheet"));
        resource.add(linkTo(methodOn(ProjectController.class).getSearchForm(null, null, null)).withRel("projectSearchForm"));
        resource.add(linkTo(methodOn(TaskController.class).get()).withRel("tasks"));
        return resource;
    }
}
