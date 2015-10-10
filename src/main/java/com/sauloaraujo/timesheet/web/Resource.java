package com.sauloaraujo.timesheet.web;

import java.util.HashMap;
import java.util.Map;

import org.springframework.hateoas.Link;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Resource {
	private Map<String, String> _links = new HashMap<>();
	
	public void add(Link link) {
		_links.put(link.getRel(), link.getHref());
	}
}