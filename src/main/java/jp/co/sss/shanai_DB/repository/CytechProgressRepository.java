package jp.co.sss.shanai_DB.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jp.co.sss.shanai_DB.entity.CytechProgress;

public interface CytechProgressRepository extends JpaRepository<CytechProgress, Long> {

    List<CytechProgress> findByEmployeeIdOrderByStepNumberAsc(Long employeeId);
}