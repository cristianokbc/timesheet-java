package com.sauloaraujo.timesheet.web.project;

import com.sauloaraujo.timesheet.web.project.ProjectSearchFormResource.ProjectSearchOptionsDto;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ProjectController {

    @RequestMapping(method = RequestMethod.GET, value="/search/form")
    public ProjectSearchFormResource getSearchForm(
            @RequestParam(value = "name", required=false) String name,
            @RequestParam(value = "description", required=false) String description,
            @RequestParam(value = "tasks", required=false) List<URI> tasks)
    {
        ProjectSearchOptionsDto options = new ProjectSearchOptionsDto();
        options.setName(name);
        options.setDescription(description);
        options.setTasks(tasks);

        ProjectSearchFormResource resource = new ProjectSearchFormResource();
        resource.setOptions(options);
        return resource;
    }

}
