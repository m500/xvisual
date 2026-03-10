export const dictionaries = {
  en: {
    tabs: { comment: "COMMENT", browse: "BROWSE" },
    status: { open: "Created", resolved: "Fixed", closed: "Approved" },
    filter: { all: "All", open: "Created", resolved: "Fixed", closed: "Approved" },
    viewport: { all: "All Devices", desktop: "Desktop", lg: "LG (Laptop)", md: "MD (Tablet)", sm: "SM (Landscape)", mobile: "Mobile" },
    sort: { newest: "Newest", oldest: "Oldest", status: "Status" },
    actions: { back: "Back", submitFix: "Submit Fix", approveFix: "Approve Fix", rejectReopen: "Reject & Reopen...", reopenTask: "Reopen Task...", reasonReopen: "Please provide a reason to reopen" },
    pipeline: { draft: "Draft: Add description", waitingAgency: "Waiting for agency", waitingClient: "Waiting for client approval", completed: "Completed" },
    empty: { noTasks: "No tasks match this filter.", draftDesc: "Draft. Needs description...", draftState: "Draft state. Add the first comment to save the task." },
    warning: { listOrphan: "Element was modified. Showing fallback position.", detailOrphanTitle: "Element is missing", detailOrphanDesc: "The HTML code changed significantly and the element cannot be found. You are seeing a 'ghost' of the original position." },
    tooltips: { back: "Back", forward: "Forward", refresh: "Refresh Canvas", newWindow: "Open in new window", orphanCanvas: "Element changed/deleted. Showing fallback position.", issueReported: "Issue reported on" },
    placeholders: { reasonReopen: "Reason for reopening (Required)...", describe: "Describe the issue...", addComment: "Add a comment... (Press Enter to send)" },
    guide: { draftTitle: "Draft - Ready to Submit", draftDesc: "Describe what needs to be changed.", waitingTitle: "Waiting for Agency", waitingDesc: "This issue is submitted. Our dev team is working on a fix.", resolvedTitle: "Waiting for Client Approval", resolvedDesc: "The developer marked this as fixed. Please review and click Approve.", closedTitle: "Task Approved & Completed", closedDesc: "This task is officially closed. If it breaks again, use the Reopen button." },
    misc: { feedbackTool: "Feedback Tool", newTask: "New Task", justNow: "Just now", changedElement: "Modified Element", markedBy: "marked by" },

    dashboard: {
      search: "Search project or client...",
      header: { title: "Projects", subtitle: "Manage your websites and client feedback in one place." },
      sidebar: { newProject: "New project", menuLabel: "MENU", overview: "Overview", projects: "Projects", teamSettingsLabel: "TEAM & SETTINGS", teamManagement: "Team management", settings: "Settings" },
      quota: { title: "Projects (Free Plan)", upgrade: "Upgrade to PRO for unlimited projects" },
      projectList: { activeProjects: "Active projects", openTasks: "Open tasks", resolvedTasks: "Resolved tasks", recentProjects: "Recent projects", createNew: "Create new project" },
      projectDetail: { 
        backToProjects: "Back to projects", activeProject: "Active project", endProject: "End project",
        copyLink: "Copy client link", linkCopied: "Link copied!", openInspector: "Open Inspector",
        filters: { allTasks: "All tasks", open: "Open", toApprove: "For approval", closed: "Closed" },
        feedbackList: "Feedback list", markedElement: "Marked element:",
        actions: { markResolved: "Mark as resolved", approve: "Approve" },
        endModal: { title: "End project?", subtitle: "This action archives the client link.", descText: "Do you really want to end project", descWarning: "The client will no longer be able to add new comments and the client link will be deactivated. This step can be reversed later.", cancel: "Cancel", confirm: "Yes, end project" }
      },
      newForm: {
        title: "Create new project",
        subtitle: "Generate a unique access for your client.",
        back: "Back to projects",
        basicInfo: "Basic information",
        clientInfo: "Client & Access",
        emailPreview: "Email invitation template",
        emailDisclaimer: "To ensure maximum trust and avoid spam filters, we don't send emails automatically. After creating the project, this template will be copied to your clipboard so you can send it from your own email.",
        linkBox: {
            title: "Client Access Link",
            pending: "Fill in Website URL and Client's name to generate the link.",
            copy: "Copy",
            copied: "Copied!"
        },
        labels: {
            projectName: "Project name",
            projectUrl: "Website URL",
            projectLang: "Client language (Inspector)",
            clientGreeting: "Official greeting (Email)",
            clientName: "Client's name (Access code)",
            clientEmail: "Client's E-mail"
        },
        placeholders: {
            projectName: "e.g. Redesign of Daily News",
            projectUrl: "e.g. yoursite.com",
            clientGreeting: "e.g. Dear Mr. Smith,",
            clientName: "e.g. Peter (Used as login password)",
            clientEmail: "peter@company.com"
        },
        descriptions: {
            clientName: "This name will serve as a simple password to open the link and will be used as the author of the comments.",
            clientEmail: "We will save this email for your records. We won't send anything automatically."
        },
        errors: {
            invalidEmail: "Please enter a valid email address"
        },
        emailTemplate: "{greeting}\n\nwe have prepared the first version of the {project} website.\n\nClick the link below and you can add your feedback directly into the website. Just click anywhere on the page.\n\nYour access code (and your name in comments) is: {name}\n\nLink: {link}",
        submit: "Create Project"
      }
    }
  },
  sk: {
    tabs: { comment: "KOMENTOVAŤ", browse: "PREHLIADAŤ" },
    status: { open: "Vytvorené", resolved: "Opravené", closed: "Schválené" },
    filter: { all: "Všetky", open: "Vytvorené", resolved: "Opravené", closed: "Schválené" },
    viewport: { all: "Všetky zariadenia", desktop: "Počítač", lg: "Notebook", md: "Tablet", sm: "Mobil na šírku", mobile: "Mobil" },
    sort: { newest: "Najnovšie", oldest: "Najstaršie", status: "Podľa stavu" },
    actions: { back: "Späť", submitFix: "Odoslať opravu", approveFix: "Schváliť opravu", rejectReopen: "Zamietnuť a znovuotvoriť...", reopenTask: "Znovuotvoriť úlohu...", reasonReopen: "Prosím, zadaj dôvod na znovuotvorenie" },
    pipeline: { draft: "Návrh: Pridaj popis", waitingAgency: "Čaká na agentúru", waitingClient: "Čaká na schválenie klientom", completed: "Dokončené" },
    empty: { noTasks: "Žiadne úlohy pre tento filter.", draftDesc: "Návrh. Čaká na popis...", draftState: "Toto je návrh. Vlož prvý komentár pre uloženie úlohy." },
    warning: { listOrphan: "Element sa zmenil. Ukazujem záchrannú pozíciu.", detailOrphanTitle: "Element sa stratil", detailOrphanDesc: "HTML kód sa príliš zmenil a element sa nedá spoľahlivo nájsť. Na webe vidíš len 'ducha' pôvodnej pozície." },
    tooltips: { back: "Späť", forward: "Dopredu", refresh: "Obnoviť plátno", newWindow: "Otvoriť naostro v novom okne", orphanCanvas: "Element sa zmenil/vymazal. Ukazujem záchrannú pozíciu.", issueReported: "Nahlásené na zariadení" },
    placeholders: { reasonReopen: "Dôvod na znovuotvorenie (Povinné)...", describe: "Popíš, čo treba zmeniť...", addComment: "Pridaj komentár... (Stlač Enter pre odoslanie)" },
    guide: { draftTitle: "Návrh - Pripravené na odoslanie", draftDesc: "Popíš, čo treba zmeniť na webe.", waitingTitle: "Čaká sa na agentúru", waitingDesc: "Úloha je odoslaná. Vývojári pracujú na oprave.", resolvedTitle: "Čaká sa na schválenie", resolvedDesc: "Vývojár označil úlohu ako opravenú. Skontroluj web a schváľ ju.", closedTitle: "Úloha schválená a dokončená", closedDesc: "Táto úloha je uzavretá. Ak sa chyba vráti, môžeš ju znovuotvoriť." },
    misc: { feedbackTool: "Nástroj na pripomienky", newTask: "Nová úloha", justNow: "Práve teraz", changedElement: "Zmenený Element", markedBy: "označil" },

    dashboard: {
      search: "Hľadať projekt alebo klienta...",
      header: { title: "Projekty", subtitle: "Spravujte svoje weby a klientsky feedback na jednom mieste." },
      sidebar: { newProject: "Nový projekt", menuLabel: "MENU", overview: "Prehľad", projects: "Projekty", teamSettingsLabel: "TÍM A NASTAVENIA", teamManagement: "Správa tímu", settings: "Nastavenia" },
      quota: { title: "Projekty (Free Plán)", upgrade: "Upgrade na PRO pre neobmedzené projekty" },
      projectList: { activeProjects: "Aktívne projekty", openTasks: "Otvorené úlohy", resolvedTasks: "Vyriešené úlohy", recentProjects: "Nedávne projekty", createNew: "Vytvoriť nový projekt" },
      projectDetail: { 
        backToProjects: "Späť na projekty", activeProject: "Aktívny projekt", endProject: "Ukončiť projekt",
        copyLink: "Kopírovať odkaz pre klienta", linkCopied: "Odkaz skopírovaný!", openInspector: "Otvoriť Inspector",
        filters: { allTasks: "Všetky úlohy", open: "Otvorené", toApprove: "Na schválenie", closed: "Zatvorené" },
        feedbackList: "Zoznam pripomienok", markedElement: "Označený prvok:",
        actions: { markResolved: "Označiť ako vyriešené", approve: "Schváliť" },
        endModal: { title: "Ukončiť projekt?", subtitle: "Táto akcia archivuje klientsky odkaz.", descText: "Naozaj chcete ukončiť projekt", descWarning: "Klient už nebude môcť pridávať nové pripomienky a klientsky odkaz bude deaktivovaný. Tento krok je možné neskôr vrátiť späť.", cancel: "Zrušiť", confirm: "Áno, ukončiť projekt" }
      },
      newForm: {
        title: "Vytvoriť nový projekt",
        subtitle: "Vygenerujte unikátny prístup pre vášho klienta.",
        back: "Zrušiť a späť",
        basicInfo: "Základné informácie",
        clientInfo: "Klient a prístup",
        emailPreview: "Šablóna e-mailovej pozvánky",
        emailDisclaimer: "Aby sme predišli spamu a zachovali maximálnu dôveryhodnosť, e-maily neodosielame my. Po vytvorení projektu sa ti tento text skopíruje, aby si ho mohol klientovi poslať zo svojho vlastného e-mailu.",
        linkBox: {
            title: "Prístupový odkaz",
            pending: "Vyplňte URL adresu webu a Meno klienta pre vygenerovanie odkazu.",
            copy: "Kopírovať",
            copied: "Skopírované!"
        },
        labels: {
            projectName: "Názov projektu",
            projectUrl: "URL adresa webu",
            projectLang: "Jazyk pre klienta (Inspector)",
            clientGreeting: "Oficiálne oslovenie (do e-mailu)",
            clientName: "Meno klienta (Prístupový kód)",
            clientEmail: "E-mail klienta"
        },
        placeholders: {
            projectName: "napr. Redizajn Denník N",
            projectUrl: "napr. dennikn.sk",
            clientGreeting: "napr. Dobrý deň p. Kováč,",
            clientName: "napr. Peter (Slúži ako heslo)",
            clientEmail: "peter@firma.sk"
        },
        descriptions: {
            clientName: "Toto meno bude slúžiť ako jednoduché heslo na otvorenie odkazu a bude zobrazené ako autor pripomienok.",
            clientEmail: "Tento e-mail uložíme len pre tvoju evidenciu. Nebudeme naň nič automaticky odosielať."
        },
        errors: {
            invalidEmail: "Zadajte prosím platnú e-mailovú adresu"
        },
        emailTemplate: "{greeting}\n\npripravili sme prvú verziu webu {project}.\n\nKlikni na odkaz nižšie a môžeš nám priamo do webu vkladať svoje pripomienky. Stačí kliknúť na akékoľvek miesto na stránke.\n\nTvoj prístupový kód (a tvoje meno v komentároch) je: {name}\n\nOdkaz: {link}",
        submit: "Vytvoriť projekt"
      }
    }
  },
  cs: {
    tabs: { comment: "KOMENTOVAT", browse: "PROCHÁZET" },
    status: { open: "Vytvořeno", resolved: "Opraveno", closed: "Schváleno" },
    filter: { all: "Vše", open: "Vytvořeno", resolved: "Opraveno", closed: "Schváleno" },
    viewport: { all: "Všechna zařízení", desktop: "Počítač", lg: "Notebook", md: "Tablet", sm: "Mobil na šířku", mobile: "Mobil" },
    sort: { newest: "Nejnovější", oldest: "Nejstarší", status: "Podle stavu" },
    actions: { back: "Zpět", submitFix: "Odeslat opravu", approveFix: "Schválit opravu", rejectReopen: "Zamítnout a znovuotevřít...", reopenTask: "Znovuotevřít úkol...", reasonReopen: "Zadej prosím důvod pro znovuotevření" },
    pipeline: { draft: "Návrh: Přidej popis", waitingAgency: "Čeká na agenturu", waitingClient: "Čeká na schválení klientem", completed: "Dokončeno" },
    empty: { noTasks: "Žádné úkoly pro tento filtr.", draftDesc: "Návrh. Čeká na popis...", draftState: "Toto je návrh. Vlož první komentář pro uložení úkolu." },
    warning: { listOrphan: "Element se změnil. Ukazuji záchrannou pozici.", detailOrphanTitle: "Element se ztratil", detailOrphanDesc: "HTML kód se příliš změnil a element nelze spolehlivě najít. Na webu vidíš jen 'ducha' původní pozice." },
    tooltips: { back: "Zpět", forward: "Dopředu", refresh: "Obnovit plátno", newWindow: "Otevřít v novém okně", orphanCanvas: "Element se změnil/smazal. Ukazuji záchrannou pozici.", issueReported: "Nahlášeno na zařízení" },
    placeholders: { reasonReopen: "Důvod pro znovuotevření (Povinné)...", describe: "Popiš, co je třeba změnit...", addComment: "Přidej komentář... (Stiskni Enter pro odeslání)" },
    guide: { draftTitle: "Návrh - Připraveno k odeslání", draftDesc: "Popiš, co je třeba změnit na webu.", waitingTitle: "Čeká se na agenturu", waitingDesc: "Úkol je odeslán. Vývojáři pracují na opravě.", resolvedTitle: "Čeká se na schválení", resolvedDesc: "Vývojář označil úkol jako opravený. Zkontroluj web a schval jej.", closedTitle: "Úkol schválen a dokončen", closedDesc: "Tento úkol je uzavřen. Pokud se chyba vrátí, můžeš jej znovuotevřít." },
    misc: { feedbackTool: "Nástroj pro připomínky", newTask: "Nový úkol", justNow: "Právě teď", changedElement: "Změněný Element", markedBy: "označil" },

    dashboard: {
      search: "Hledat projekt nebo klienta...",
      header: { title: "Projekty", subtitle: "Spravujte své weby a klientský feedback na jednom místě." },
      sidebar: { newProject: "Nový projekt", menuLabel: "MENU", overview: "Přehled", projects: "Projekty", teamSettingsLabel: "TÝM A NASTAVENÍ", teamManagement: "Správa týmu", settings: "Nastavení" },
      quota: { title: "Projekty (Free Plán)", upgrade: "Upgrade na PRO pro neomezené projekty" },
      projectList: { activeProjects: "Aktivní projekty", openTasks: "Otevřené úkoly", resolvedTasks: "Vyřešené úkoly", recentProjects: "Nedávné projekty", createNew: "Vytvořit nový projekt" },
      projectDetail: { 
        backToProjects: "Zpět na projekty", activeProject: "Aktivní projekt", endProject: "Ukončit projekt",
        copyLink: "Kopírovat odkaz pro klienta", linkCopied: "Odkaz zkopírován!", openInspector: "Otevřít Inspector",
        filters: { allTasks: "Všechny úkoly", open: "Otevřené", toApprove: "Ke schválení", closed: "Zavřené" },
        feedbackList: "Seznam připomínek", markedElement: "Označený prvek:",
        actions: { markResolved: "Označit jako vyřešené", approve: "Schválit" },
        endModal: { title: "Ukončit projekt?", subtitle: "Tato akce archivuje klientský odkaz.", descText: "Opravdu chcete ukončit projekt", descWarning: "Klient již nebude moci přidávat nové připomínky a klientský odkaz bude deaktivován. Tento krok lze později vrátit zpět.", cancel: "Zrušit", confirm: "Ano, ukončit projekt" }
      },
      newForm: {
        title: "Vytvořit nový projekt",
        subtitle: "Vygenerujte unikátní přístup pro vašeho klienta.",
        back: "Zpět na projekty",
        basicInfo: "Základní informace",
        clientInfo: "Klient a přístup",
        emailPreview: "Šablona e-mailové pozvánky",
        emailDisclaimer: "Abychom předešli spamu a zachovali maximální důvěryhodnost, e-maily neodesíláme my. Po vytvoření projektu se ti tento text zkopíruje, abys ho mohl klientovi poslat ze svého vlastního e-mailu.",
        linkBox: {
            title: "Přístupový odkaz",
            pending: "Vyplňte URL adresu webu a Jméno klienta pro vygenerování odkazu.",
            copy: "Kopírovat",
            copied: "Zkopírováno!"
        },
        labels: {
            projectName: "Název projektu",
            projectUrl: "URL adresa webu",
            projectLang: "Jazyk pro klienta (Inspector)",
            clientGreeting: "Oficiální oslovení (do e-mailu)",
            clientName: "Jméno klienta (Přístupový kód)",
            clientEmail: "E-mail klienta"
        },
        placeholders: {
            projectName: "např. Redesign Denník N",
            projectUrl: "např. dennikn.sk",
            clientGreeting: "např. Dobrý den p. Kovář,",
            clientName: "např. Peter (Slouží jako heslo)",
            clientEmail: "peter@firma.cz"
        },
        descriptions: {
            clientName: "Toto jméno bude sloužit jako jednoduché heslo k otevření odkazu a bude zobrazeno jako autor připomínek.",
            clientEmail: "Tento e-mail uložíme pouze pro tvoji evidenci. Nebudeme na něj nic automaticky odesílat."
        },
        errors: {
            invalidEmail: "Zadejte prosím platnou e-mailovou adresu"
        },
        emailTemplate: "{greeting}\n\npřipravili jsme první verzi webu {project}.\n\nKlikni na odkaz níže a můžeš nám přímo do webu vkládat své připomínky. Stačí kliknout kamkoliv na stránku.\n\nTvoj přístupový kód (a tvé jméno v komentářích) je: {name}\n\nOdkaz: {link}",
        submit: "Vytvořit projekt"
      }
    }
  },
  de: {
    tabs: { comment: "KOMMENTIEREN", browse: "DURCHSUCHEN" },
    status: { open: "Erstellt", resolved: "Behoben", closed: "Freigegeben" },
    filter: { all: "Alle", open: "Erstellt", resolved: "Behoben", closed: "Freigegeben" },
    viewport: { all: "Alle Geräte", desktop: "Desktop", lg: "Laptop", md: "Tablet", sm: "Handy (Querformat)", mobile: "Handy" },
    sort: { newest: "Neueste", oldest: "Älteste", status: "Nach Status" },
    actions: { back: "Zurück", submitFix: "Korrektur einreichen", approveFix: "Korrektur freigeben", rejectReopen: "Ablehnen & neu öffnen...", reopenTask: "Aufgabe neu öffnen...", reasonReopen: "Bitte gib einen Grund für die Wiedereröffnung an" },
    pipeline: { draft: "Entwurf: Beschreibung hinzufügen", waitingAgency: "Warten auf Agentur", waitingClient: "Warten auf Kundenfreigabe", completed: "Abgeschlossen" },
    empty: { noTasks: "Keine Aufgaben für diesen Filter.", draftDesc: "Entwurf. Benötigt Beschreibung...", draftState: "Entwurfsstatus. Füge den ersten Kommentar hinzu, um die Aufgabe zu speichern." },
    warning: { listOrphan: "Element wurde geändert. Zeige Fallback-Position.", detailOrphanTitle: "Element fehlt", detailOrphanDesc: "Der HTML-Code hat sich zu stark geändert und das Element kann nicht gefunden werden. Du siehst einen 'Geist' der ursprünglichen Position." },
    tooltips: { back: "Zurück", forward: "Vorwärts", refresh: "Leinwand neu laden", newWindow: "In neuem Fenster öffnen", orphanCanvas: "Element geändert/gelöscht. Zeige Fallback-Position.", issueReported: "Gemeldet auf" },
    placeholders: { reasonReopen: "Grund für Wiedereröffnung (Pflichtfeld)...", describe: "Beschreibe das Problem...", addComment: "Kommentar hinzufügen... (Enter zum Senden)" },
    guide: { draftTitle: "Entwurf - Bereit zum Senden", draftDesc: "Beschreibe, was geändert werden muss.", waitingTitle: "Warten auf Agentur", waitingDesc: "Diese Aufgabe wurde eingereicht. Die Entwickler arbeiten an einer Lösung.", resolvedTitle: "Warten auf Kundenfreigabe", resolvedDesc: "Der Entwickler hat dies als behoben markiert. Bitte prüfen und freigeben.", closedTitle: "Aufgabe freigegeben & abgeschlossen", closedDesc: "Diese Aufgabe ist offiziell geschlossen. Falls das Problem erneut auftritt, kannst du sie neu öffnen." },
    misc: { feedbackTool: "Feedback-Tool", newTask: "Neue Aufgabe", justNow: "Gerade eben", changedElement: "Geändertes Element", markedBy: "markiert von" },

    dashboard: {
      search: "Projekt oder Kunde suchen...",
      header: { title: "Projekte", subtitle: "Verwalten Sie Ihre Websites und Kundenfeedback an einem Ort." },
      sidebar: { newProject: "Neues Projekt", menuLabel: "MENÜ", overview: "Übersicht", projects: "Projekte", teamSettingsLabel: "TEAM & EINSTELLUNGEN", teamManagement: "Teamverwaltung", settings: "Einstellungen" },
      quota: { title: "Projekte (Kostenloser Plan)", upgrade: "Upgrade auf PRO für unbegrenzte Projekte" },
      projectList: { activeProjects: "Aktive Projekte", openTasks: "Offene Aufgaben", resolvedTasks: "Gelöste Aufgaben", recentProjects: "Letzte Projekte", createNew: "Neues Projekt erstellen" },
      projectDetail: { 
        backToProjects: "Zurück zu Projekten", activeProject: "Aktives Projekt", endProject: "Projekt beenden",
        copyLink: "Kundenlink kopieren", linkCopied: "Link kopiert!", openInspector: "Inspector öffnen",
        filters: { allTasks: "Alle Aufgaben", open: "Offen", toApprove: "Zur Freigabe", closed: "Abgeschlossen" },
        feedbackList: "Feedback-Liste", markedElement: "Markiertes Element:",
        actions: { markResolved: "Als gelöst markieren", approve: "Freigeben" },
        endModal: { title: "Projekt beenden?", subtitle: "Diese Aktion archiviert den Kundenlink.", descText: "Möchten Sie das Projekt wirklich beenden", descWarning: "Der Kunde kann keine neuen Kommentare mehr hinzufügen und der Kundenlink wird deaktiviert. Dieser Schritt kann später rückgängig gemacht werden.", cancel: "Abbrechen", confirm: "Ja, Projekt beenden" }
      },
      newForm: {
        title: "Neues Projekt erstellen",
        subtitle: "Generieren Sie einen einzigartigen Zugang für Ihren Kunden.",
        back: "Zurück zu Projekten",
        basicInfo: "Basisinformationen",
        clientInfo: "Kunde & Zugang",
        emailPreview: "E-Mail-Einladungsvorlage",
        emailDisclaimer: "Um Spam-Filter zu vermeiden und Vertrauen zu gewährleisten, versenden wir keine automatischen E-Mails. Nach Erstellung des Projekts wird diese Vorlage kopiert, damit Sie sie von Ihrer eigenen E-Mail senden können.",
        linkBox: {
            title: "Zugangslink",
            pending: "Füllen Sie die Website-URL und den Kundennamen aus, um den Link zu generieren.",
            copy: "Kopieren",
            copied: "Kopiert!"
        },
        labels: {
            projectName: "Projektname",
            projectUrl: "Website-URL",
            projectLang: "Kundensprache (Inspector)",
            clientGreeting: "Offizielle Anrede (E-Mail)",
            clientName: "Name des Kunden (Zugangscode)",
            clientEmail: "E-Mail des Kunden"
        },
        placeholders: {
            projectName: "z.B. Redesign Daily News",
            projectUrl: "z.B. deine-website.de",
            clientGreeting: "z.B. Sehr geehrter Herr Schmidt,",
            clientName: "z.B. Peter (Dient als Passwort)",
            clientEmail: "peter@firma.de"
        },
        descriptions: {
            clientName: "Dieser Name dient als einfaches Passwort zum Öffnen des Links und wird als Autor der Kommentare angezeigt.",
            clientEmail: "Wir speichern diese E-Mail nur für Ihre Unterlagen. Wir senden keine automatischen E-Mails."
        },
        errors: {
            invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein"
        },
        emailTemplate: "{greeting}\n\nwir haben die erste Version der Website {project} vorbereitet.\n\nKlicke auf den untenstehenden Link und du kannst dein Feedback direkt auf der Website eintragen. Klicke einfach auf eine beliebige Stelle der Seite.\n\nDein Zugangscode (und dein Name in den Kommentaren) ist: {name}\n\nLink: {link}",
        submit: "Projekt erstellen"
      }
    }
  }
};

export type Language = keyof typeof dictionaries;