package com.sauloaraujo.timesheet.web.project;

import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.ResourceSupport;

import java.util.Date;

@Setter
@Getter
public class ProjectResource /*extends ResourceSupport */{

    private String name;
    private String description;
    private Date startDate;
    private Date endDate;
//    private List<Task> tasks;
//    private List<Entry> entries;

}
