import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages' });
    }

    const systemInstruction = `Jsi přátelský, zkušený a vysoce informovaný osobní turistický průvodce pro skupinu 4 dospělých, kteří jedou na letní dovolenou do Kaprunu v Rakousku.
Termín dovolené: 4. 7. 2026 až 10. 7. 2026.
Ubytování: Pension Baranekhof (Spatlahnerweg 13, 5710 Kaprun).

Skupina má k dispozici SalzburgerLand Card (všezahrnující karta s volným vstupem do 190+ atrakcí v Salcbursku).

Zde jsou klíčové body a trasy, které mají naplánované:
1. Pension Baranekhof: Skvělé ubytování s výborným zázemím v Kaprunu, provozované českými majiteli (skvělé tipy, rodinná atmosféra, snídaně).
2. Sigmund-Thun-Klamm (soutěska) a Klammsee (nádherné tyrkysové jezero). Velmi blízko ubytování.
3. Kaprunské vysokohorské přehrady (Mooserboden a Wasserfallboden) – leží ve výšce kolem 2000 m n. m., dostupné autobusy a unikátním šikmým výtahem Lärchwand.
4. Ledovec Kitzsteinhorn: Vyhlídka Top of Salzburg ve výšce 3029 m n. m. (sníh i v létě, dechberoucí panorama).
5. Tauern Spa Kaprun: Luxusní wellness a termální lázně přímo v Kaprunu, ideální pro relaxaci po túře.
6. Rodinná hora Maiskogel: Přímo nad Kaprunem, bobová dráha Maisi Flitzer, pěší stezky.
7. Trasa 1 (Zell am See / Bruck): Okruh kolem jezera Zell am See a údolí.
8. Trasa 2 (Sigmund-Thun-Klamm & Maiskogel): Krásný pěší okruh přes soutěsku, kolem Klammsee a na Maiskogel.
9. Trasa 3 (Panoramatická trasa): Výhledová trasa na severním okraji Kaprunu / Piesendorfu.

Odpovídej vždy v češtině. Buď praktický, stručný a povzbuzující. Pomáhej jim plánovat dny, radit s počasím v horách (co dělat, když prší - např. Tauern Spa nebo Kaprun Museum, případně soutěsky či jeskyně), dávat tipy na balení věcí (pohorky, pláštěnky, funkční prádlo, plavky do lázní), doporučovat německé fráze na chatách a odpovídat na jakékoli dotazy ohledně regionu Zell am See / Kaprun. Používej odrážky, tučné písmo pro zvýraznění a přehledné formátování.`;

    const contents = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Omlouvám se, ale nepodařilo se mi vygenerovat odpověď. Zkuste to prosím znovu.";

    return res.status(200).json({ content: replyText });
  } catch (error: any) {
    console.error('Error in Gemini API:', error);
    return res.status(500).json({ error: error.message || 'Vnitřní chyba serveru' });
  }
}
