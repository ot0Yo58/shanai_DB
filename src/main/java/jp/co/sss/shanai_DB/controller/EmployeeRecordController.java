package jp.co.sss.shanai_DB.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jp.co.sss.shanai_DB.entity.CytechProgress;
import jp.co.sss.shanai_DB.entity.Employee;
import jp.co.sss.shanai_DB.entity.InternalEventParticipation;
import jp.co.sss.shanai_DB.entity.Interview;
import jp.co.sss.shanai_DB.entity.PrivateEvent;
import jp.co.sss.shanai_DB.entity.SupportCase;
import jp.co.sss.shanai_DB.repository.CytechProgressRepository;
import jp.co.sss.shanai_DB.repository.EmployeeRepository;
import jp.co.sss.shanai_DB.repository.InternalEventParticipationRepository;
import jp.co.sss.shanai_DB.repository.InterviewRepository;
import jp.co.sss.shanai_DB.repository.PrivateEventRepository;
import jp.co.sss.shanai_DB.repository.SupportCaseRepository;

@Controller
@RequestMapping("/employees/{employeeId}")
public class EmployeeRecordController {

    private final EmployeeRepository employeeRepository;
    private final CytechProgressRepository cytechProgressRepository;
    private final InterviewRepository interviewRepository;
    private final SupportCaseRepository supportCaseRepository;
    private final PrivateEventRepository privateEventRepository;
    private final InternalEventParticipationRepository internalEventParticipationRepository;

    public EmployeeRecordController(
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

    @PostMapping("/cytech-progresses")
    public String addCytechProgress(
            @PathVariable Long employeeId,
            @ModelAttribute CytechProgress cytechProgress
    ) {
        Employee employee = findEmployee(employeeId);
        cytechProgress.setEmployee(employee);
        cytechProgressRepository.save(cytechProgress);

        return "redirect:/employees/" + employeeId + "/edit?section=cytech";
    }

    @PostMapping("/cytech-progresses/{recordId}/update")
    public String updateCytechProgress(
            @PathVariable Long employeeId,
            @PathVariable Long recordId,
            @ModelAttribute CytechProgress form
    ) {
        CytechProgress record = cytechProgressRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("Cytech進捗が見つかりません。id=" + recordId));

        record.setStepNumber(form.getStepNumber());
        record.setStepName(form.getStepName());
        record.setStatus(form.getStatus());
        record.setStartedAt(form.getStartedAt());
        record.setCompletedAt(form.getCompletedAt());
        record.setMemo(form.getMemo());

        cytechProgressRepository.save(record);

        return "redirect:/employees/" + employeeId + "/edit?section=cytech";
    }

    @PostMapping("/cytech-progresses/{recordId}/delete")
    public String deleteCytechProgress(
            @PathVariable Long employeeId,
            @PathVariable Long recordId
    ) {
        cytechProgressRepository.deleteById(recordId);
        return "redirect:/employees/" + employeeId + "/edit?section=cytech";
    }

    @PostMapping("/interviews")
    public String addInterview(
            @PathVariable Long employeeId,
            @ModelAttribute Interview interview
    ) {
        Employee employee = findEmployee(employeeId);
        interview.setEmployee(employee);
        interviewRepository.save(interview);

        return "redirect:/employees/" + employeeId + "/edit?section=interviews";
    }

    @PostMapping("/interviews/{recordId}/update")
    public String updateInterview(
            @PathVariable Long employeeId,
            @PathVariable Long recordId,
            @ModelAttribute Interview form
    ) {
        Interview record = interviewRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("面談履歴が見つかりません。id=" + recordId));

        record.setInterviewDate(form.getInterviewDate());
        record.setInterviewerName(form.getInterviewerName());
        record.setTitle(form.getTitle());
        record.setContent(form.getContent());
        record.setNextAction(form.getNextAction());

        interviewRepository.save(record);

        return "redirect:/employees/" + employeeId + "/edit?section=interviews";
    }

    @PostMapping("/interviews/{recordId}/delete")
    public String deleteInterview(
            @PathVariable Long employeeId,
            @PathVariable Long recordId
    ) {
        interviewRepository.deleteById(recordId);
        return "redirect:/employees/" + employeeId + "/edit?section=interviews";
    }

    @PostMapping("/support-cases")
    public String addSupportCase(
            @PathVariable Long employeeId,
            @ModelAttribute SupportCase supportCase
    ) {
        Employee employee = findEmployee(employeeId);
        supportCase.setEmployee(employee);
        supportCaseRepository.save(supportCase);

        return "redirect:/employees/" + employeeId + "/edit?section=support";
    }

    @PostMapping("/support-cases/{recordId}/update")
    public String updateSupportCase(
            @PathVariable Long employeeId,
            @PathVariable Long recordId,
            @ModelAttribute SupportCase form
    ) {
        SupportCase record = supportCaseRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("問い合わせ・トラブル履歴が見つかりません。id=" + recordId));

        record.setCaseType(form.getCaseType());
        record.setTitle(form.getTitle());
        record.setOccurredAt(form.getOccurredAt());
        record.setStatus(form.getStatus());
        record.setContent(form.getContent());
        record.setCauseText(form.getCauseText());
        record.setResponseText(form.getResponseText());
        record.setPrevention(form.getPrevention());

        supportCaseRepository.save(record);

        return "redirect:/employees/" + employeeId + "/edit?section=support";
    }

    @PostMapping("/support-cases/{recordId}/delete")
    public String deleteSupportCase(
            @PathVariable Long employeeId,
            @PathVariable Long recordId
    ) {
        supportCaseRepository.deleteById(recordId);
        return "redirect:/employees/" + employeeId + "/edit?section=support";
    }

    @PostMapping("/internal-events")
    public String addInternalEventParticipation(
            @PathVariable Long employeeId,
            @ModelAttribute InternalEventParticipation participation
    ) {
        Employee employee = findEmployee(employeeId);
        participation.setEmployee(employee);
        internalEventParticipationRepository.save(participation);

        return "redirect:/employees/" + employeeId + "/edit?section=internalEvents";
    }

    @PostMapping("/internal-events/{recordId}/update")
    public String updateInternalEventParticipation(
            @PathVariable Long employeeId,
            @PathVariable Long recordId,
            @ModelAttribute InternalEventParticipation form
    ) {
        InternalEventParticipation record = internalEventParticipationRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("社内イベント参加履歴が見つかりません。id=" + recordId));

        record.setEventDate(form.getEventDate());
        record.setEventType(form.getEventType());
        record.setEventName(form.getEventName());
        record.setStatus(form.getStatus());
        record.setMemo(form.getMemo());

        internalEventParticipationRepository.save(record);

        return "redirect:/employees/" + employeeId + "/edit?section=internalEvents";
    }

    @PostMapping("/internal-events/{recordId}/delete")
    public String deleteInternalEventParticipation(
            @PathVariable Long employeeId,
            @PathVariable Long recordId
    ) {
        internalEventParticipationRepository.deleteById(recordId);
        return "redirect:/employees/" + employeeId + "/edit?section=internalEvents";
    }

    @PostMapping("/private-events")
    public String addPrivateEvent(
            @PathVariable Long employeeId,
            @ModelAttribute PrivateEvent privateEvent
    ) {
        Employee employee = findEmployee(employeeId);
        privateEvent.setEmployee(employee);
        privateEventRepository.save(privateEvent);

        return "redirect:/employees/" + employeeId + "/edit?section=privateEvents";
    }

    @PostMapping("/private-events/{recordId}/update")
    public String updatePrivateEvent(
            @PathVariable Long employeeId,
            @PathVariable Long recordId,
            @ModelAttribute PrivateEvent form
    ) {
        PrivateEvent record = privateEventRepository.findById(recordId)
                .orElseThrow(() -> new IllegalArgumentException("プライベートイベントが見つかりません。id=" + recordId));

        record.setEventDate(form.getEventDate());
        record.setEventType(form.getEventType());
        record.setTitle(form.getTitle());
        record.setVisibilityLevel(form.getVisibilityLevel());
        record.setContent(form.getContent());

        privateEventRepository.save(record);

        return "redirect:/employees/" + employeeId + "/edit?section=privateEvents";
    }

    @PostMapping("/private-events/{recordId}/delete")
    public String deletePrivateEvent(
            @PathVariable Long employeeId,
            @PathVariable Long recordId
    ) {
        privateEventRepository.deleteById(recordId);
        return "redirect:/employees/" + employeeId + "/edit?section=privateEvents";
    }

    private Employee findEmployee(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("社員が見つかりません。id=" + employeeId));
    }
}