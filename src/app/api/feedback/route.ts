import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Načítame len komentáre, ktoré patria k danému HASHU (projectId)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId'); // Hľadáme hash

  if (!projectId) return NextResponse.json([]);

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { 
        projectId: projectId // <--- KĽÚČOVÁ ZMENA: Filtrujeme podľa hashu
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    return NextResponse.json({ error: 'Chyba načítania' }, { status: 500 });
  }
}

// POST: Ukladáme komentár aj s HASHOM
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.text || !body.selector || !body.projectId) {
      return NextResponse.json({ error: 'Chýbajú údaje' }, { status: 400 });
    }

    const savedFeedback = await prisma.feedback.create({
      data: {
        text: body.text,
        selector: body.selector,
        url: body.url || 'unknown',
        projectId: body.projectId, // <--- Ukladáme hash
        x: parseFloat(body.x),
        y: parseFloat(body.y),
        status: 'open',
      },
    });

    return NextResponse.json(savedFeedback);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ... (tvoj existujúci GET a POST nechaj tak, ako sú) ...

// PATCH: Aktualizácia stavu (napr. na "resolved")
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) return NextResponse.json({ error: 'Chýba ID alebo status' }, { status: 400 });

    const updated = await prisma.feedback.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Chyba aktualizácie' }, { status: 500 });
  }
}

// DELETE: Vymazanie komentára
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Chýba ID' }, { status: 400 });

    await prisma.feedback.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Chyba mazania' }, { status: 500 });
  }
}