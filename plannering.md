
Inlämningsuppgift 2
I denna sista inlämningsuppgift ska ni skapa en fullständig blockkedja fören egenkrypto valuta med transaktionshantering och validering av transaktionerna.

Ni ska använda er av en transaktionspool för att hantera transaktioner innan de placeras i ett block. När ett block skapas för transaktionerna ska även en ”belöningstransaktion”skapas och spåras i transaktionspoolen.

Transaktionerna måste valideras så att de följer de regler som vi gått igenom under lektionerna.

Nätverk
Det ska gå att starta upp flera noder med blockkedjan. Synkronisering av blockkedjan ska ske vid uppstart av en ny nod, vid addering av transaktioner samt när ett block skapas.

Teknologin för nätverks kommunikation ska vara antingen Redis, Pubnub eller Websockets.

Blockkedjan, block samt transaktioner ska sparas ner i en mongodb databas.(Även om detta i princip inte är nödvändigt i en verklig blockkedja).

Säkerhet
För att kunna nyttja en blockkedja som konsument måste man vara registrerad och inloggad. Här ska ni använda Json Web Token(JWT) som teknologi för att validera att en användare är inloggad och tillhöra korrekt roll för att kunna skapa en ny transaktion och att kunna lista sina egna transaktioner samt block. Användare ska lagras i ett mongodb dokument.


Klient
En klient ska utvecklas i antingen React med Vite eller en renodlad JavaScript applikation med HTML och CSS.

Klient applikationen ska kunna skapa nya transaktioner, lista transaktioner och lista block.

Dessutom ska det gå att skapa ett block med transaktioner, dvs ”mine”av block.

Godkänt krav (G)
Allt ovanstående måste vara på plats för betyget G.

Välgodkänt(VG)
För VG ska TDD användas för transaktionshanteringen. Alla ”Best practices”som vi gått igenom under kursens gång ska användas. Det vill säga Clean Code, SOC, MVC.Dessutom ska servern vara säker mot olika typer av angrepp, till exempelNoSqlinjections, DDOSsamtXSSförsök.





1. Setup
 - Skapa projektmappar för server och klient.
 - Initiera npm-projekt och installera nödvändiga beroenden.

2. Användarhantering
 - Skapa användarmodell i MongoDB
 - Implementera registreringsruta
 - Implementera inloggningsruta
 - Implementera JWT-hantering för autentisering och auktorisering

3. Blockkedja/Transaktioner
 - Skapa modeller för Block, Blockchain och Transaction
 - Implementera transaktionspool
 - Implementera funktionalitet för belöningstransaktioner

4. Synkronisering av Noder
 - Konfigurera Pubnub för nätverkskommunikation
 - Implementera funktioner för synkronisering vid uppstart
 - Implementera funktioner för synkronisering vid addering av transaktioner
 - Implementera funktioner för synkronisering vid blockskaping

5. Databaslagring/hantering
 - Implementera funktionalitet för att spara blockkedjan, block och transaktioner i MongoDB
 - Implementera funktionalitet för att ladda blockkedjan från databasen vid uppstart

6. Klientapplikation
 - Skapa en React-applikation
 - UI för att skapa nya transaktioner
 - UI för att lista transaktioner
 - UI för att lista block.
 - funktionalitet för att skapa nya block (mine)

 VG-Den (Om tid finns och du orkar)

7. Säkerhet
 -  Implementera säkerhetsåtgärder för att skydda mot NoSQL-injections
 -  Implementera rate-limiting för att skydda mot DDoS-attacker
 -  Implementera input-sanitization för att skydda mot XSS-attacker

8. Testdriven Utveckling (TDD)
 - Skriv enhetstester för alla kritiska delar av applikationen
 - Implementera tester för användarautentisering och auktorisering
 - Använd "best practices" för Clean Code, SOC och MVC









