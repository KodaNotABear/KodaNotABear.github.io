# Generates public/resume.pdf (game-dev-first) and public/resume-swe.pdf
# (software-engineering-first, for platform/web roles).
# Run with: python scripts/generate-resume.py
# Layout is single-column and text-native to stay ATS-friendly.
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle,
)

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "scripts" / "fonts"

pdfmetrics.registerFont(TTFont("Rajdhani-Bold", FONTS / "Rajdhani-Bold.ttf"))
pdfmetrics.registerFont(TTFont("Rajdhani-SemiBold", FONTS / "Rajdhani-SemiBold.ttf"))
pdfmetrics.registerFont(TTFont("JBMono", FONTS / "JetBrainsMono-Regular.ttf"))

INK = HexColor("#16181d")       # near-black body text
MUTED = HexColor("#5a6372")     # secondary text
ACCENT = HexColor("#007ea0")    # site --accent-cyan-dim, print-friendly
VIOLET = HexColor("#4c1d95")

styles = {
    "name": ParagraphStyle("name", fontName="Rajdhani-Bold", fontSize=27,
                           leading=30, textColor=INK, spaceAfter=1),
    "tagline": ParagraphStyle("tagline", fontName="Rajdhani-SemiBold", fontSize=13,
                              leading=16, textColor=ACCENT, spaceAfter=4),
    "contact": ParagraphStyle("contact", fontName="JBMono", fontSize=8,
                              leading=11, textColor=MUTED, spaceAfter=0),
    "section": ParagraphStyle("section", fontName="Rajdhani-Bold", fontSize=12.5,
                              leading=14, textColor=ACCENT, spaceBefore=5,
                              spaceAfter=2),
    "role": ParagraphStyle("role", fontName="Rajdhani-SemiBold", fontSize=11.5,
                           leading=13.5, textColor=INK),
    "date": ParagraphStyle("date", fontName="JBMono", fontSize=8,
                           leading=13.5, textColor=MUTED, alignment=TA_RIGHT),
    "org": ParagraphStyle("org", fontName="Helvetica-Oblique", fontSize=9.5,
                          leading=12, textColor=VIOLET, spaceAfter=1.5),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=9.5,
                           leading=13, textColor=INK),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=9.5,
                             leading=12.2, textColor=INK, leftIndent=11,
                             bulletIndent=2, spaceAfter=1),
    "skill": ParagraphStyle("skill", fontName="Helvetica", fontSize=9.5,
                            leading=13.5, textColor=INK),
}


def section(title):
    return [
        Paragraph(title, styles["section"]),
        HRFlowable(width="100%", thickness=1.1, color=ACCENT, spaceAfter=4),
    ]


def entry(role, org, date, bullets, gap=2):
    head = Table(
        [[Paragraph(role, styles["role"]), Paragraph(date, styles["date"])]],
        colWidths=[5.05 * inch, 2.15 * inch],
    )
    head.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    out = [head, Paragraph(org, styles["org"])]
    out += [Paragraph(b, styles["bullet"], bulletText="•") for b in bullets]
    out.append(Spacer(1, gap))
    return out


CONTACT = (
    "Gilbert, AZ · 602-849-1101 · epeterson3136@gmail.com · "
    '<link href="https://akuro.studio" color="#007ea0">akuro.studio</link> · '
    '<link href="https://github.com/KodaNotABear" color="#007ea0">github.com/KodaNotABear</link>'
)

PIXEL_PIRATE_ORG = "Pixel Pirate Studio · Off-Road Champion (mobile racing, Unity)"
PP_ONBOARDING = (
    "Designed and implemented the new-player onboarding system, guiding players through core "
    "mechanics and progression goals in their first session"
)
PP_TOURNAMENT = (
    "Shipped a tournament update where players compete for virtual currency, connected to a web "
    "portal for live standings and rewards"
)
PP_WEBGL = "Ported Off-Road Champion to WebGL for browser play"
PP_AGILE = (
    "Collaborated with designers and producers in an Agile team across daily standups, sprint "
    "planning, and code review"
)

AKURO_BULLETS = [
    "Developing <b>Black Signal</b>, a first-person horror game in Unity (C#) set on a derelict space "
    "station; designing and prototyping the core loop, UI, and level layout as the sole developer",
]

FSAE_BULLETS = [
    "Designed and tested on-vehicle data acquisition tools across three race seasons",
    "Built embedded systems for live telemetry capture, including an infrared lap timing system "
    "used for on-track performance analysis",
]

LEAGUE_BULLETS = [
    "C# / ASP.NET web app for League of Legends stats lookup, backed by a WCF service layer over "
    "the <b>Riot Games API</b>: Riot ID lookup, total champion mastery, and last-match stats",
    "Implemented member and staff login flows with reCAPTCHA verification, sessions, and cookies",
]

COGITATION_BULLETS = [
    "Create add-on in Java (NeoForge 1.21.1): a mechanical neural-network datacenter that turns "
    "surplus rotational power into compute, trains models of mobs, and simulates their loot with "
    "zero spawned entities, a performance-friendly alternative to entity farms",
    "Shipped a playable beta: multiblock networks with flood-fill discovery and proportional "
    "compute allocation, sequenced-assembly recipes, an advancement tree, and full balance config",
]

EDUCATION = entry(
    "B.S. Computer Science, Software Engineering Focus", "Arizona State University", "May 2026",
    [
        "Coursework: Game Development, Computer Graphics, Algorithms, OS · Formula SAE · SoDA",
    ],
    gap=0,
)


def build(out_name, tagline, summary, experience, projects, skills):
    story = [
        Paragraph("ETHAN PETERSON", styles["name"]),
        Paragraph(tagline, styles["tagline"]),
        Paragraph(CONTACT, styles["contact"]),
        Spacer(1, 6),
        HRFlowable(width="100%", thickness=2.2, color=ACCENT, spaceAfter=6),
        Paragraph(summary, styles["body"]),
    ]
    story += section("EXPERIENCE")
    for e in experience:
        story += entry(*e)
    story += section("PROJECTS")
    for e in projects:
        story += entry(*e)
    story += section("SKILLS")
    for group, items in skills:
        story.append(Paragraph(f"<b>{group}:</b> {items}", styles["skill"]))
    story += section("EDUCATION")
    story += EDUCATION

    out = ROOT / "public" / out_name
    doc = SimpleDocTemplate(
        str(out), pagesize=letter,
        leftMargin=0.62 * inch, rightMargin=0.62 * inch,
        topMargin=0.48 * inch, bottomMargin=0.42 * inch,
        title="Ethan Peterson, " + tagline.replace("&amp;", "&").title(),
        author="Ethan Peterson",
        subject="Resume",
    )
    doc.build(story)

    from pypdf import PdfReader
    pages = len(PdfReader(str(out)).pages)
    print(f"OK {out} ({pages} page{'s' if pages != 1 else ''})")
    assert pages == 1, f"{out_name} must fit on one page. Tighten spacing or trim bullets"


# ── Variant 1: game programmer (default, linked from the site) ──
build(
    "resume.pdf",
    "GAME PROGRAMMER &amp; DESIGNER",
    "Game programmer with a B.S. in Computer Science (Arizona State University, May 2026) and nine months "
    "of professional Unity experience shipping onboarding, LiveOps, and WebGL features for a live mobile "
    "racing game. Three years building embedded race telemetry for a collegiate FSAE team. Currently "
    "prototyping <b>Black Signal</b>, an original first-person horror game in Unity. Seeking a junior "
    "game programmer role.",
    experience=[
        ("Game Development Intern", PIXEL_PIRATE_ORG, "Aug 2025 – May 2026",
         [PP_ONBOARDING, PP_TOURNAMENT, PP_WEBGL,
          "Collaborated with designers and producers in an Agile team: standups, sprint planning, code review"]),
        ("Founder &amp; Solo Developer", "AKURO STUDIO", "2025 – Present", AKURO_BULLETS),
        ("Data Acquisition Developer",
         "Sun Devil Motorsports (Formula SAE), Arizona State University",
         "Jun 2022 – 2025", FSAE_BULLETS),
    ],
    projects=[
        ("Create: Cognition", "AKURO STUDIO · Create add-on for Minecraft", "Jun 2026 – Present",
         COGITATION_BULLETS),
        ("League Stats Portal", "Class project, Arizona State University", "Spring 2026",
         LEAGUE_BULLETS[:1]),
    ],
    skills=[
        ("Languages", "C# (Unity, ASP.NET) · C++ · Java · Python · JavaScript / React · HTML &amp; CSS"),
        ("Engines &amp; Tools", "Unity (3+ years) · Git / GitHub · Blender · FMOD · JetBrains Rider · Visual Studio"),
        ("Game Development", "Gameplay systems · UI implementation · Level design · WebGL builds · Onboarding / LiveOps"),
        ("Engineering", "Embedded systems · Data acquisition · Game servers (Docker / VPS) · Agile / Scrum"),
    ],
)

# ── Variant 2: software engineer (for platform / web roles) ──
build(
    "resume-swe.pdf",
    "SOFTWARE ENGINEER",
    "Software engineer with a B.S. in Computer Science (Arizona State University, May 2026) and nine "
    "months of professional experience shipping features for a live Unity mobile game and its companion "
    "web portal. Comfortable across the stack: C# / .NET services, React front ends, Python tooling, and "
    "self-hosted Docker deployments. Seeking a junior software engineer role.",
    experience=[
        ("Game Development Intern", PIXEL_PIRATE_ORG, "Aug 2025 – May 2026",
         [PP_TOURNAMENT, PP_ONBOARDING, PP_WEBGL, PP_AGILE]),
        ("Data Acquisition Developer",
         "Sun Devil Motorsports (Formula SAE), Arizona State University",
         "Jun 2022 – 2025",
         ["Designed and tested embedded on-vehicle data acquisition and telemetry tools across "
          "three race seasons, including an infrared lap timing system"]),
        ("Founder &amp; Solo Developer", "AKURO STUDIO", "2025 – Present",
         ["Designing and prototyping <b>Black Signal</b>, an original first-person horror game in "
          "Unity (C#), as the sole developer"]),
    ],
    projects=[
        ("League Stats Portal", "Class project, Arizona State University", "Spring 2026",
         LEAGUE_BULLETS),
        ("Create: Cognition", "AKURO STUDIO · Create add-on for Minecraft", "Jun 2026 – Present",
         ["Java mod (NeoForge 1.21.1) in beta: multiblock compute networks with flood-fill discovery "
          "and proportional allocation, simulating mob loot with zero spawned entities to cut server load"]),
        ("akuro.studio", "Personal site", "2026",
         ["React 19 + Vite portfolio with build-time art generation, deployed to GitHub Pages "
          "through a GitHub Actions CI pipeline"]),
    ],
    skills=[
        ("Languages", "C# (.NET, Unity) · JavaScript / React · Python · Java · C++ · HTML &amp; CSS"),
        ("Web &amp; Services", "ASP.NET · WCF · REST APIs · Vite · GitHub Actions CI"),
        ("Infrastructure", "Docker · Linux VPS · Game server hosting · Git / GitHub"),
        ("Practices", "Agile / Scrum · Code review · Embedded systems · Data acquisition"),
    ],
)
