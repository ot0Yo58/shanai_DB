package jp.co.sss.shanai_DB.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jp.co.sss.shanai_DB.entity.Employee;
import jp.co.sss.shanai_DB.repository.CytechProgressRepository;
import jp.co.sss.shanai_DB.repository.EmployeeRepository;
import jp.co.sss.shanai_DB.repository.InternalEventParticipationRepository;
import jp.co.sss.shanai_DB.repository.InterviewRepository;
import jp.co.sss.shanai_DB.repository.PrivateEventRepository;
import jp.co.sss.shanai_DB.repository.SupportCaseRepository;

@Controller
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepository;
    private final CytechProgressRepository cytechProgressRepository;
    private final InterviewRepository interviewRepository;
    private final SupportCaseRepository supportCaseRepository;
    private final PrivateEventRepository privateEventRepository;
    private final InternalEventParticipationRepository internalEventParticipationRepository;

    public EmployeeController(
            EmployeeRepository employeeRepository,
            CytechProgressRepository cytechProgressRepository,
            InterviewRepository interviewRepository,
            SupportCaseRepository supportCaseRepository,
            PrivateEventRepository privateEventRepository,
            InternalEventParticipationRepository internalEventParticipationRepository
    ) {
        this.employeeRepository = employeeRepository;
        this.cytechProgressRepository = cytechProgressRepository;
        this.interviewRepository = interviewRepository;
        this.supportCaseRepository = supportCaseRepository;
        this.privateEventRepository = privateEventRepository;
        this.internalEventParticipationRepository = internalEventParticipationRepository;
    }

    @GetMapping
    public String index(@RequestParam(name = "q", required = false) String q, Model model) {
        List<Employee> employees;

        if (StringUtils.hasText(q)) {
            employees = employeeRepository.findByNameContainingIgnoreCaseOrderByIdDesc(q);
        } else {
            employees = employeeRepository.findAllByOrderByIdDesc();
        }

        model.addAttribute("employees", employees);
        model.addAttribute("q", q);
        return "employees/index";
    }

    @GetMapping("/new")
    public String newEmployee(Model model) {
        model.addAttribute("employee", new Employee());
        return "employees/new";
    }

    @PostMapping
    public String create(@Valid @ModelAttribute Employee employee, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return "employees/new";
        }

        employeeRepository.save(employee);
        return "redirect:/employees";
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable Long id, Model model) {
        Employee employee = findEmployee(id);

        model.addAttribute("employee", employee);
        addEmployeeRecordsToModel(id, model);

        return "employees/detail";
    }

    @GetMapping("/{id}/edit")
    public String edit(
            @PathVariable Long id,
            @RequestParam(name = "section", required = false, defaultValue = "basic") String section,
            Model model
    ) {
        Employee employee = findEmployee(id);

        model.addAttribute("employee", employee);
        model.addAttribute("activeSection", section);
        addEmployeeRecordsToModel(id, model);

        return "employees/edit";
    }

    @PostMapping("/{id}/update")
    public String update(
            @PathVariable Long id,
            @RequestParam(name = "section", required = false, defaultValue = "basic") String section,
            @Valid @ModelAttribute Employee formEmployee,
            BindingResult bindingResult,
            Model model
    ) {
        if (bindingResult.hasErrors()) {
            formEmployee.setId(id);
            model.addAttribute("employee", formEmployee);
            model.addAttribute("activeSection", section);
            addEmployeeRecordsToModel(id, model);
            return "employees/edit";
        }

        Employee employee = findEmployee(id);

        employee.setEmployeeCode(formEmployee.getEmployeeCode());
        employee.setName(formEmployee.getName());
        employee.setNameKana(formEmployee.getNameKana());
        employee.setBirthday(formEmployee.getBirthday());
        employee.setAddress(formEmployee.getAddress());
        employee.setJoinDate(formEmployee.getJoinDate());
        employee.setCommuteMethod(formEmployee.getCommuteMethod());
        employee.setFutureVision(formEmployee.getFutureVision());
        employee.setMemo(formEmployee.getMemo());

        employeeRepository.save(employee);

        return "redirect:/employees/" + id + "/edit?section=basic";
    }

    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id) {
        Employee employee = findEmployee(id);
        employeeRepository.delete(employee);
        return "redirect:/employees";
    }

    private Employee findEmployee(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("社員が見つかりません。id=" + id));
    }

    private void addEmployeeRecordsToModel(Long id, Model model) {
        model.addAttribute("cytechProgresses", cytechProgressRepository.findByEmployeeIdOrderByStepNumberAsc(id));
        model.addAttribute("interviews", interviewRepository.findByEmployeeIdOrderByInterviewDateDescIdDesc(id));
        model.addAttribute("supportCases", supportCaseRepository.findByEmployeeIdOrderByOccurredAtDescIdDesc(id));
        model.addAttribute("privateEvents", privateEventRepository.findByEmployeeIdOrderByEventDateDescIdDesc(id));
        model.addAttribute("internalEventParticipations",
                internalEventParticipationRepository.findByEmployeeIdOrderByEventDateDescIdDesc(id));
    }
}