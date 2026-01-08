package com.blood.blood_emergency_backend.controller;

import com.blood.blood_emergency_backend.model.Donor;
import com.blood.blood_emergency_backend.service.DonorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donors")
@CrossOrigin(origins = "*")
public class DonorController {

    private final DonorService service;

    public DonorController(DonorService service) {
        this.service = service;
    }

    @GetMapping
    public List<Donor> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Donor add(@RequestBody Donor donor) {
        return service.save(donor);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/filter")
    public List<Donor> filter(
            @RequestParam(required = false) String blood,
            @RequestParam(required = false) String city) {
        return service.filter(blood, city);
    }
    @GetMapping("/load-json")
    public List<Donor> loadJson() throws Exception {
        var resource = new org.springframework.core.io.ClassPathResource("donors.json");
        var json = new String(resource.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
        return mapper.readValue(json, new com.fasterxml.jackson.core.type.TypeReference<List<Donor>>() {});
    }

}
