package com.sauloaraujo.timesheet.web.project;

import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.ResourceSupport;

import java.util.List;

@Setter
@Getter
public class ProjectSearchResultsResource extends ResourceSupport {
    private List<ProjectResource> projects;
}
