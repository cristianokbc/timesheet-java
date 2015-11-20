package com.sauloaraujo.timesheet.web.project;

import com.sauloaraujo.timesheet.domain.task.Task;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.ResourceSupport;

import java.net.URI;
import java.util.List;

@Getter
@Setter
public class ProjectSearchFormResource extends ResourceSupport {

    private ProjectSearchOptionsDto options;

    @Getter
    @Setter
    public static class ProjectSearchOptionsDto {
        private String name;
        private String description;
        private List<URI> tasks;
    }
}
