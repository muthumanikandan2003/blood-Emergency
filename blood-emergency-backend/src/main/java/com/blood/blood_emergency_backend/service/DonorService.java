package com.blood.blood_emergency_backend.service;

import com.blood.blood_emergency_backend.model.Donor;
import com.blood.blood_emergency_backend.repository.DonorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class DonorService {
    private final DonorRepository repo;

    public DonorService(DonorRepository repo) {
        this.repo = repo;
    }

    public List<Donor> getAll() {
        return repo.findAll();
    }

    public Donor save(Donor donor) {
        return repo.save(donor);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<Donor> filter(String blood, String city) {
        if (blood == null && city == null) return repo.findAll();
        if (blood != null && city != null) return repo.findByBloodAndCityContainingIgnoreCase(blood, city);
        if (blood != null) return repo.findByBloodAndCityContainingIgnoreCase(blood, "");
        return repo.findAll();
    }
}
