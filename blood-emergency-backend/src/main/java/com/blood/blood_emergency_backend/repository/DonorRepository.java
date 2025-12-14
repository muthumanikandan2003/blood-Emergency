package com.blood.blood_emergency_backend.repository;

import com.blood.blood_emergency_backend.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    List<Donor> findByBloodAndCityContainingIgnoreCase(String blood, String city);
}
