import { jsPDF } from "jspdf";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  
  // Créer une nouvelle instance de jsPDF
  const doc = new jsPDF();

  // Ajouter du contenu au PDF
  doc.text(
    "Bonjour, voici votre PDF généré avec Next.js 14 et TypeScript!",
    10,
    10,
  );

  // Générer le PDF
  const pdfBuffer = doc.output("arraybuffer");

  // Créer une nouvelle réponse avec le PDF
  const response = new NextResponse(Buffer.from(pdfBuffer));

  // Définir les en-têtes de réponse
  response.headers.set("Content-Type", "application/pdf");
  response.headers.set(
    "Content-Disposition",
    "attachment; filename=document.pdf",
  );

  return response;
}

interface PostData {
  name: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Récupérer les données du corps de la requête
  const data: PostData = await request.json();

  // Créer une nouvelle instance de jsPDF
  const doc = new jsPDF();

  // Utiliser les données pour personnaliser le PDF
  doc.text(`Bonjour ${data.name}, voici votre PDF personnalisé!`, 10, 10);

  // Générer le PDF
  const pdfBuffer = doc.output("arraybuffer");

  // Créer une nouvelle réponse avec le PDF
  const response = new NextResponse(Buffer.from(pdfBuffer));

  // Définir les en-têtes de réponse
  response.headers.set("Content-Type", "application/pdf");
  response.headers.set(
    "Content-Disposition",
    "attachment; filename=document.pdf",
  );

  return response;
}
