package com.sauloaraujo.timesheet.web.task;

import com.sauloaraujo.timesheet.domain.task.TaskService;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService service;

    @Autowired
    private MapperFacade mapper;

    @RequestMapping(method = RequestMethod.GET)
    public List<TaskResource> get() {
        return mapper.mapAsList(service.findAll(), TaskResource.class);
    }

    @RequestMapping(method = RequestMethod.GET, value="/{id}")
    public TaskResource get(
            @PathVariable("id") int id)
    {
        return mapper.map(service.findOne(id), TaskResource.class);
    }
}
