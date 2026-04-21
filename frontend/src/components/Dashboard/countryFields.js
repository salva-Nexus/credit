// Country-based transfer field configurations
export const COUNTRIES = [
  // ── Domestic ──────────────────────────────────────────────────────────────
  { code: "US", name: "United States", flag: "🇺🇸", type: "local" },

  // ── European Countries ────────────────────────────────────────────────────
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", type: "international" },
  { code: "DE", name: "Germany", flag: "🇩🇪", type: "international" },
  { code: "FR", name: "France", flag: "🇫🇷", type: "international" },
  { code: "IT", name: "Italy", flag: "🇮🇹", type: "international" },
  { code: "ES", name: "Spain", flag: "🇪🇸", type: "international" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", type: "international" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", type: "international" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", type: "international" },
  { code: "AT", name: "Austria", flag: "🇦🇹", type: "international" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", type: "international" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", type: "international" },
  { code: "NO", name: "Norway", flag: "🇳🇴", type: "international" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", type: "international" },
  { code: "FI", name: "Finland", flag: "🇫🇮", type: "international" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", type: "international" },
  { code: "PL", name: "Poland", flag: "🇵🇱", type: "international" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", type: "international" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", type: "international" },
  { code: "RO", name: "Romania", flag: "🇷🇴", type: "international" },
  { code: "HR", name: "Croatia", flag: "🇭🇷", type: "international" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰", type: "international" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮", type: "international" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", type: "international" },
  { code: "GR", name: "Greece", flag: "🇬🇷", type: "international" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹", type: "international" },
  { code: "LV", name: "Latvia", flag: "🇱🇻", type: "international" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", type: "international" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺", type: "international" },
  { code: "MT", name: "Malta", flag: "🇲🇹", type: "international" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾", type: "international" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", type: "international" },

  // ── Spanish-Speaking Countries ────────────────────────────────────────────
  { code: "MX", name: "Mexico", flag: "🇲🇽", type: "international" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻", type: "international" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", type: "international" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", type: "international" },
  { code: "CL", name: "Chile", flag: "🇨🇱", type: "international" },
  { code: "PE", name: "Peru", flag: "🇵🇪", type: "international" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", type: "international" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", type: "international" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", type: "international" },
  { code: "CU", name: "Cuba", flag: "🇨🇺", type: "international" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", type: "international" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴", type: "international" },
  { code: "HN", name: "Honduras", flag: "🇭🇳", type: "international" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", type: "international" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮", type: "international" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", type: "international" },
  { code: "PA", name: "Panama", flag: "🇵🇦", type: "international" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", type: "international" },
  { code: "PR", name: "Puerto Rico", flag: "🇵🇷", type: "international" },
];

const euroFields = (placeholder = "Full name") => [
  {
    name: "recipientName",
    label: "Account Holder Full Name",
    placeholder,
    required: true,
  },
  {
    name: "iban",
    label: "IBAN",
    placeholder: "e.g. DE89 3704 0044 0532 0130 00",
    required: true,
    hint: "International Bank Account Number",
  },
  {
    name: "swiftCode",
    label: "SWIFT/BIC Code",
    placeholder: "e.g. DEUTDEDB",
    required: true,
  },
  {
    name: "bankName",
    label: "Bank Name",
    placeholder: "e.g. Deutsche Bank",
    required: true,
  },
  {
    name: "accountType",
    label: "Account Type",
    type: "select",
    options: ["Current", "Savings"],
    required: true,
  },
];

const latinFields = (placeholder = "Full name", extra = []) => [
  {
    name: "recipientName",
    label: "Account Holder Full Name",
    placeholder,
    required: true,
  },
  {
    name: "accountNumber",
    label: "Account Number",
    placeholder: "Bank account number",
    required: true,
  },
  {
    name: "bankName",
    label: "Bank Name",
    placeholder: "Full bank name",
    required: true,
  },
  ...extra,
  {
    name: "swiftCode",
    label: "SWIFT/BIC Code",
    placeholder: "8 or 11 character code",
    required: true,
  },
  {
    name: "accountType",
    label: "Account Type",
    type: "select",
    options: ["Savings", "Current", "Checking"],
    required: true,
  },
];

export const getCountryFields = (countryCode) => {
  switch (countryCode) {
    // ── Domestic ────────────────────────────────────────────────────────────
    case "US":
      return [
        {
          name: "recipientName",
          label: "Recipient Full Name",
          placeholder: "John Smith",
          required: true,
        },
        {
          name: "bankName",
          label: "Bank Name",
          placeholder: "e.g. Bank of America",
          required: true,
        },
        {
          name: "bankAddress",
          label: "Bank Address",
          placeholder: "123 Main St, New York, NY 10001",
          required: true,
        },
        {
          name: "routingNumber",
          label: "ABA Routing Number",
          placeholder: "9-digit routing number",
          required: true,
          hint: "Your bank's 9-digit ABA routing number",
        },
        {
          name: "accountNumber",
          label: "Account Number",
          placeholder: "Recipient's account number",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Checking", "Savings", "Money Market"],
          required: true,
        },
        {
          name: "recipientAddress",
          label: "Recipient Address",
          placeholder: "Street, City, State, ZIP",
          required: true,
        },
      ];

    // ── UK ──────────────────────────────────────────────────────────────────
    case "GB":
      return [
        {
          name: "recipientName",
          label: "Recipient Full Name",
          placeholder: "John Smith",
          required: true,
        },
        {
          name: "bankName",
          label: "Bank Name",
          placeholder: "e.g. Barclays",
          required: true,
        },
        {
          name: "sortCode",
          label: "Sort Code",
          placeholder: "XX-XX-XX",
          required: true,
          hint: "6-digit UK sort code",
        },
        {
          name: "accountNumber",
          label: "Account Number",
          placeholder: "8-digit account number",
          required: true,
        },
        {
          name: "iban",
          label: "IBAN (optional)",
          placeholder: "GB29 NWBK 6016 1331 9268 19",
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. BARCGB22",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Current", "Savings"],
          required: true,
        },
      ];

    // ── European (IBAN/SWIFT) ────────────────────────────────────────────────
    case "DE":
      return euroFields("Hans Müller");
    case "FR":
      return euroFields("Jean Dupont");
    case "IT":
      return euroFields("Marco Rossi");
    case "ES":
      return euroFields("Carlos García");
    case "NL":
      return euroFields("Jan de Vries");
    case "BE":
      return euroFields("Jean Dupont");
    case "PT":
      return euroFields("João Silva");
    case "AT":
      return euroFields("Hans Müller");
    case "CH":
      return [
        {
          name: "recipientName",
          label: "Account Holder Full Name",
          placeholder: "Hans Müller",
          required: true,
        },
        {
          name: "iban",
          label: "IBAN",
          placeholder: "CH56 0483 5012 3456 7800 9",
          required: true,
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. UBSWCHZH",
          required: true,
        },
        {
          name: "bankName",
          label: "Bank Name",
          placeholder: "e.g. UBS, Credit Suisse",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Private", "Savings"],
          required: true,
        },
      ];
    case "SE":
      return euroFields("Erik Svensson");
    case "NO":
      return euroFields("Erik Hansen");
    case "DK":
      return euroFields("Lars Jensen");
    case "FI":
      return euroFields("Mikko Virtanen");
    case "IE":
      return euroFields("Seán Murphy");
    case "PL":
      return euroFields("Jan Kowalski");
    case "CZ":
      return euroFields("Jan Novák");
    case "HU":
      return euroFields("Kovács János");
    case "RO":
      return euroFields("Ion Popescu");
    case "HR":
      return euroFields("Ivan Horvat");
    case "SK":
      return euroFields("Ján Novák");
    case "SI":
      return euroFields("Janez Novak");
    case "BG":
      return euroFields("Ivan Ivanov");
    case "GR":
      return euroFields("Γιώργης Παπαδόπουλος");
    case "LT":
      return euroFields("Jonas Jonaitis");
    case "LV":
      return euroFields("Jānis Bērziņš");
    case "EE":
      return euroFields("Jaan Tamm");
    case "LU":
      return euroFields("Jean Schmit");
    case "MT":
      return euroFields("John Borg");
    case "CY":
      return euroFields("Nikos Papadopoulos");
    case "UA":
      return euroFields("Іван Коваленко");

    // ── Spanish-speaking countries ────────────────────────────────────────────
    case "MX":
      return latinFields("Juan García", [
        {
          name: "clabe",
          label: "CLABE",
          placeholder: "18-digit CLABE number",
          required: true,
          hint: "Mexican interbank code (18 digits)",
        },
      ]);
    case "SV":
      return latinFields("Carlos Martínez", [
        {
          name: "routingNumber",
          label: "Routing Number",
          placeholder: "Bank routing number",
          required: true,
        },
      ]);
    case "AR":
      return latinFields("Juan González", [
        {
          name: "cbu",
          label: "CBU / CVU",
          placeholder: "22-digit CBU number",
          required: true,
          hint: "Clave Bancaria Uniforme (22 digits)",
        },
      ]);
    case "CO":
      return latinFields("Juan Rodríguez");
    case "CL":
      return latinFields("Juan Pérez", [
        {
          name: "rut",
          label: "RUT",
          placeholder: "e.g. 12.345.678-9",
          required: true,
        },
      ]);
    case "PE":
      return latinFields("Juan López");
    case "VE":
      return latinFields("Juan Hernández");
    case "EC":
      return latinFields("Juan Torres");
    case "GT":
      return latinFields("Juan Morales");
    case "CU":
      return latinFields("Juan Jiménez");
    case "BO":
      return latinFields("Juan Quispe");
    case "DO":
      return latinFields("Juan Reyes");
    case "HN":
      return latinFields("Juan Flores");
    case "PY":
      return latinFields("Juan Romero");
    case "NI":
      return latinFields("Juan Castillo");
    case "CR":
      return latinFields("Juan Mora");
    case "PA":
      return latinFields("Juan Díaz");
    case "UY":
      return latinFields("Juan Fernández");
    case "PR":
      return latinFields("Juan Rivera", [
        {
          name: "routingNumber",
          label: "ABA Routing Number",
          placeholder: "9-digit routing number",
          required: true,
        },
      ]);

    default:
      return [
        {
          name: "recipientName",
          label: "Account Holder Full Name",
          placeholder: "Full name",
          required: true,
        },
        {
          name: "accountNumber",
          label: "Account Number / IBAN",
          placeholder: "Account number or IBAN",
          required: true,
        },
        {
          name: "bankName",
          label: "Bank Name",
          placeholder: "Full bank name",
          required: true,
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "8 or 11 character code",
          required: true,
        },
        {
          name: "bankAddress",
          label: "Bank Address",
          placeholder: "Bank address",
          required: false,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Savings", "Current", "Checking"],
          required: true,
        },
      ];
  }
};
