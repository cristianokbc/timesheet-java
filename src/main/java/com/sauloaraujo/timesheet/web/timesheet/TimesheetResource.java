package com.sauloaraujo.timesheet.web.timesheet;

import com.sauloaraujo.timesheet.domain.timesheet.EntryCell;
import lombok.Getter;
import lombok.Setter;
import org.springframework.hateoas.ResourceSupport;

import java.util.Date;
import java.util.List;

@Setter
@Getter
public class TimesheetResource extends ResourceSupport {
    private List<Date> dates;
    private List<ProjectRowDto> projectRows;

    @Getter
    @Setter
    public static class ProjectRowDto {
        private String project;
        private int id;
        private List<TaskRowDto> taskRows;

        @Getter
        @Setter
        public static class TaskRowDto {
            private int id;
            private String task;
            private List<EntryCell> entryCells;
        }

    }
}
