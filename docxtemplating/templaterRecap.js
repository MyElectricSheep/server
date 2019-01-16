const JSZip = require("jszip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");
const path = require("path");

//Load the docx file as a binary
let content = fs.readFileSync(
  path.resolve(__dirname, "matrice_tableau_recapitulatif.docx"),
  "binary"
);

const zip = new JSZip(content);

const doc = new Docxtemplater();
doc.loadZip(zip);

//set the templateVariables
doc.setData({
  denomination_sociale_creancier: "",
  denomination_sociale_debiteur: "",
  numero_facture: "",
  date_facture: "",
  montant_facture: "",
  taux_BCE: "",
  points_entreprise_française: "", // taux BCE + 10 points
  points_entreprise_italienne: "", // taux BCE + 8 points
  date_debut: "",
  date_fin: "",
  nombre_jours_interets: "",
  taux: "",
  montant_interets: "",
  montant_acompte: "",
  date_reglement_acompte: "",
  montant_avoir: "",
  date_avoir: "",
  montant_total_interets: "",
  loi_entreprise_française: ""
  //  Art. L 441-6 du Code de commerce : "Sauf disposition contraire qui ne peut toutefois fixer un taux
  //  inférieur à trois fois le tauxd'intérêt légal, ce taux est égal au taux d'intérêt appliqué par la BCE majoré de 10 points
  //  de pourcentage (...) Les pénalités de retard  sont  exigibles  sans  qu'un  rappel  soit  nécessaire."  /  Décret  n°  2012-1115
  //  du  2  octobre  2012  "A  compter  du  1er  janvier 2013, tout professionnel en situation de retard de paiement devient de plein
  //  droit débiteur, à l'égard de son créancier, (...) d'une indemnité forfaitaire pour frais de recouvrement de 40 euros."
});

// debtor's name for the filename
let debiteur_filename = "";

// creditor's name  for the filename
let creancier_filename = "";

try {
  // render the document
  doc.render();
} catch (error) {
  const e = {
    message: error.mesage,
    name: error.name,
    stack: error.stack,
    properties: error.properties
  };
  console.log(JSON.stringify({ error: e }));
  throw error;
}

const buf = doc.getZip().generate({ type: "nodebuffer" });

fs.writeFileSync(
  path.resolve(
    __dirname,
    `Tableau calcul intérêts - ${creancier_filename} contre ${debiteur_filename}.docx`
  ),
  buf
);
