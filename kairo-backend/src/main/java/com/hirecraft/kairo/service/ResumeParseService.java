package com.hirecraft.kairo.service;

import com.hirecraft.kairo.dto.ParsedResumeDTO;
import org.apache.tika.Tika;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeParseService {

    private static final Logger log = LoggerFactory.getLogger(ResumeParseService.class);
    private final Tika tika = new Tika();

    private static final Pattern EMAIL = Pattern.compile("[A-Za-z0-9._%+\\-]+@[A-Za-z0-9.\\-]+\\.[A-Za-z]{2,}");
    private static final Pattern PHONE = Pattern.compile("(\\+?\\d[\\d\\s().\\-]{7,}\\d)");

    private static final String[] TITLE_WORDS = {
            "engineer", "developer", "designer", "manager", "analyst", "scientist",
            "consultant", "architect", "lead", "intern", "specialist", "marketer",
            "product", "associate", "director", "head of", "founder", "researcher"
    };

    private static final String[] SKILLS = {
            "React", "TypeScript", "JavaScript", "Node.js", "Python", "Java", "Spring Boot", "Spring",
            "SQL", "PostgreSQL", "MySQL", "MongoDB", "AWS", "Azure", "GCP", "Docker", "Kubernetes",
            "Figma", "Prototyping", "User Research", "Design Systems", "Wireframing", "Interaction Design",
            "HTML", "CSS", "Tailwind", "Redux", "GraphQL", "REST", "Git", "CI/CD",
            "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Data Analysis", "Excel",
            "Tableau", "Power BI", "Product Management", "Roadmapping", "Agile", "Scrum", "Jira",
            "Photoshop", "Illustrator", "Sketch", "Kafka", "Redis", "Go", "Kotlin", "Swift", "Flutter",
            "Angular", "Vue", "Next.js", "Spark", "Airflow", "dbt", "Snowflake", "Communication", "Leadership"
    };

    public ParsedResumeDTO parse(MultipartFile file) throws Exception {
        String text;
        try (InputStream in = file.getInputStream()) {
            text = tika.parseToString(in);
        }
        if (text == null) text = "";
        String[] lines = text.split("\\r?\\n");

        ParsedResumeDTO dto = new ParsedResumeDTO();
        dto.setEmail(firstMatch(EMAIL, text));
        dto.setPhone(cleanPhone(firstMatch(PHONE, text)));
        dto.setName(guessName(lines, dto.getEmail()));
        dto.setHeadline(guessHeadline(lines, dto.getName()));
        dto.setLocation(guessLocation(lines, dto.getName()));
        dto.setSkills(extractSkills(text));
        log.info("[RESUME] parsed {} chars -> name='{}' email='{}' skills={}",
                text.length(), dto.getName(), dto.getEmail(), dto.getSkills().size());
        return dto;
    }

    // ---------- helpers ----------

    private String firstMatch(Pattern p, String text) {
        Matcher m = p.matcher(text);
        return m.find() ? m.group().trim() : null;
    }

    private String cleanPhone(String raw) {
        if (raw == null) return null;
        String digits = raw.replaceAll("[^\\d+]", "");
        return digits.length() >= 8 && digits.length() <= 16 ? raw.trim() : null;
    }

    private String guessName(String[] lines, String email) {
        for (int i = 0; i < Math.min(lines.length, 8); i++) {
            String l = lines[i].trim();
            if (l.isEmpty()) continue;
            if (l.contains("@") || l.matches(".*\\d{3,}.*")) continue;
            if (l.length() > 40) continue;
            String[] toks = l.split("\\s+");
            if (toks.length < 2 || toks.length > 4) continue;
            boolean ok = true;
            for (String t : toks) {
                if (!t.matches("[A-Za-z.'\\-]+")) { ok = false; break; }
            }
            if (ok) return titleCase(l);
        }
        if (email != null && email.contains("@")) {
            String local = email.substring(0, email.indexOf('@')).replaceAll("[._0-9]+", " ").trim();
            if (!local.isBlank()) return titleCase(local);
        }
        return "";
    }

    private String guessHeadline(String[] lines, String name) {
        for (int i = 0; i < Math.min(lines.length, 15); i++) {
            String l = lines[i].trim();
            if (l.isEmpty() || l.contains("@")) continue;
            if (name != null && l.equalsIgnoreCase(name)) continue;
            if (l.length() > 60) continue;
            String low = l.toLowerCase();
            for (String k : TITLE_WORDS) {
                if (low.contains(k)) return l;
            }
        }
        return "";
    }

    private String guessLocation(String[] lines, String name) {
        for (int i = 0; i < Math.min(lines.length, 15); i++) {
            String l = lines[i].trim();
            if (l.isEmpty() || l.contains("@") || l.length() > 40) continue;
            if (name != null && l.equalsIgnoreCase(name)) continue;
            // "City, Country" — letters and one comma
            if (l.matches("[A-Za-z .]+,\\s*[A-Za-z .]+") && !l.toLowerCase().matches(".*(university|institute|college|ltd|inc|technolog).*")) {
                return l;
            }
        }
        return "";
    }

    private List<String> extractSkills(String text) {
        String low = text.toLowerCase();
        List<String> found = new ArrayList<>();
        for (String s : SKILLS) {
            if (low.contains(s.toLowerCase()) && !found.contains(s)) found.add(s);
            if (found.size() >= 12) break;
        }
        return found;
    }

    private String titleCase(String s) {
        StringBuilder sb = new StringBuilder();
        for (String w : s.trim().toLowerCase().split("\\s+")) {
            if (w.isEmpty()) continue;
            sb.append(Character.toUpperCase(w.charAt(0))).append(w.substring(1)).append(' ');
        }
        return sb.toString().trim();
    }
}
