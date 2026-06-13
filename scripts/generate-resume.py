# Generates public/resume.pdf, a one-page game-dev-first resume.
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
OUT = ROOT / "public" / "resume.pdf"

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
                              leading=15, textColor=ACCENT, spaceBefore=7,
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
                             leading=12.6, textColor=INK, leftIndent=11,
                             bulletIndent=2, spaceAfter=1.5),
    "skill": ParagraphStyle("skill", fontName="Helvetica", fontSize=9.5,
                            leading=13.5, textColor=INK),
}


def section(title):
    return [
        Paragraph(title, styles["section"]),
        HRFlowable(width="100%", thickness=1.1, color=ACCENT, spaceAfter=5),
    ]


def entry(role, org, date, bullets):
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
    out.append(Spacer(1, 5))
    return out


story = [
    Paragraph("ETHAN PETERSON", styles["name"]),
    Paragraph("GAME PROGRAMMER &amp; DESIGNER", styles["tagline"]),
    Paragraph(
        "Gilbert, AZ · 602-849-1101 · epeterson3136@gmail.com · "
        '<link href="https://akuro.studio" color="#007ea0">akuro.studio</link> · '
        '<link href="https://github.com/KodaNotABear" color="#007ea0">github.com/KodaNotABear</link>',
        styles["contact"],
    ),
    Spacer(1, 7),
    HRFlowable(width="100%", thickness=2.2, color=ACCENT, spaceAfter=7),
    Paragraph(
        "Game programmer with a B.S. in Computer Science (Arizona State University, May 2026) and nine months "
        "of professional Unity experience shipping onboarding, LiveOps, and WebGL features for a live mobile "
        "racing game. Three years building embedded race telemetry for a collegiate FSAE team. Currently "
        "building <b>Black Signal</b>, an original first-person horror game in Unity. Seeking a junior game programmer role.",
        styles["body"],
    ),
]

story += section("EXPERIENCE")
story += entry(
    "Game Development Intern", "Pixel Pirate Studio · Off-Road Champion (mobile racing, Unity)",
    "Aug 2025 – May 2026",
    [
        "Designed and implemented the new-player onboarding system, guiding players through core "
        "mechanics and progression goals in their first session",
        "Shipped a tournament update where players compete for virtual currency, connected to a web "
        "portal for live standings and rewards",
        "Ported Off-Road Champion to WebGL for browser play",
        "Collaborated with designers and producers in an Agile team across daily standups, sprint planning, and code review",
    ],
)
story += entry(
    "Founder &amp; Solo Developer", "AKURO STUDIO", "2025 – Present",
    [
        "Developing <b>Black Signal</b>, a first-person horror game in Unity (C#) set on a derelict space "
        "station, where the player explores on foot and flags anomalies while sensors and onboard tasks "
        "compete for attention",
        "Building all of its gameplay, anomaly, and sensor systems, UI, and level design as the sole developer",
    ],
)
story += entry(
    "Data Acquisition Developer", "Sun Devil Motorsports (Formula SAE), Arizona State University",
    "Jun 2022 – 2025",
    [
        "Designed and tested on-vehicle data acquisition tools across three race seasons",
        "Built embedded systems for live telemetry capture, including an infrared lap timing system "
        "used for on-track performance analysis",
        "Integrated data systems across mechanical and electrical sub-teams",
    ],
)

story += section("SKILLS")
for group, items in [
    ("Languages", "C# (Unity) · C++ · Java · Python · JavaScript / React · HTML &amp; CSS"),
    ("Engines &amp; Tools", "Unity (3+ years) · Git / GitHub · Blender · FMOD · JetBrains Rider · Visual Studio"),
    ("Game Development", "Gameplay systems · UI implementation · Level design · WebGL builds · Onboarding / LiveOps"),
    ("Engineering", "Embedded systems · Data acquisition · Game servers (Docker / VPS) · Agile / Scrum"),
]:
    story.append(Paragraph(f"<b>{group}:</b> {items}", styles["skill"]))

story += section("EDUCATION")
story += entry(
    "B.S. Computer Science, Software Engineering Focus", "Arizona State University", "May 2026",
    [
        "Coursework: Game Development, Computer Graphics, Data Structures &amp; Algorithms, Operating "
        "Systems, Software Engineering",
        "Activities: Formula SAE (Sun Devil Motorsports, 2022–2025) · Software Developers Association (SoDA)",
    ],
)

doc = SimpleDocTemplate(
    str(OUT), pagesize=letter,
    leftMargin=0.62 * inch, rightMargin=0.62 * inch,
    topMargin=0.5 * inch, bottomMargin=0.45 * inch,
    title="Ethan Peterson, Game Programmer & Designer",
    author="Ethan Peterson",
    subject="Resume",
)
doc.build(story)

from pypdf import PdfReader  # noqa: E402
pages = len(PdfReader(str(OUT)).pages)
print(f"OK {OUT} ({pages} page{'s' if pages != 1 else ''})")
assert pages == 1, "Resume must fit on one page. Tighten spacing or trim bullets"
