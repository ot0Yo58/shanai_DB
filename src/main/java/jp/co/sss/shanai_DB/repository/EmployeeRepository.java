package jp.co.sss.shanai_DB.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jp.co.sss.shanai_DB.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findAllByOrderByIdDesc();

    List<Employee> findByNameContainingIgnoreCaseOrderByIdDesc(String name);
}