// Country-based transfer field configurations
export const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", type: "local" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", type: "international" },
  { code: "CA", name: "Canada", flag: "🇨🇦", type: "international" },
  { code: "AU", name: "Australia", flag: "🇦🇺", type: "international" },
  { code: "DE", name: "Germany", flag: "🇩🇪", type: "international" },
  { code: "FR", name: "France", flag: "🇫🇷", type: "international" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", type: "international" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", type: "international" },
  { code: "KE", name: "Kenya", flag: "🇰🇪", type: "international" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", type: "international" },
  { code: "IN", name: "India", flag: "🇮🇳", type: "international" },
  { code: "CN", name: "China", flag: "🇨🇳", type: "international" },
  { code: "JP", name: "Japan", flag: "🇯🇵", type: "international" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", type: "international" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", type: "international" },
  { code: "PH", name: "Philippines", flag: "🇵🇭", type: "international" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", type: "international" },
  { code: "AE", name: "UAE", flag: "🇦🇪", type: "international" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", type: "international" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼", type: "international" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿", type: "international" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹", type: "international" },
  { code: "EG", name: "Egypt", flag: "🇪🇬", type: "international" },
  { code: "IT", name: "Italy", flag: "🇮🇹", type: "international" },
  { code: "ES", name: "Spain", flag: "🇪🇸", type: "international" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", type: "international" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭", type: "international" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", type: "international" },
  { code: "NO", name: "Norway", flag: "🇳🇴", type: "international" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", type: "international" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰", type: "international" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩", type: "international" },
  { code: "TR", name: "Turkey", flag: "🇹🇷", type: "international" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", type: "international" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾", type: "international" },
  { code: "TH", name: "Thailand", flag: "🇹🇭", type: "international" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", type: "international" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", type: "international" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰", type: "international" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿", type: "international" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", type: "international" },
  { code: "CL", name: "Chile", flag: "🇨🇱", type: "international" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", type: "international" },
  { code: "PL", name: "Poland", flag: "🇵🇱", type: "international" },
  { code: "RU", name: "Russia", flag: "🇷🇺", type: "international" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦", type: "international" },
  { code: "IL", name: "Israel", flag: "🇮🇱", type: "international" },
  { code: "QA", name: "Qatar", flag: "🇶🇦", type: "international" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼", type: "international" },
];

// Returns array of field definitions for the given country code
export const getCountryFields = (countryCode) => {
  switch (countryCode) {
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
          pattern: /^\d{9}$/,
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
    case "CA":
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
          placeholder: "e.g. RBC",
          required: true,
        },
        {
          name: "transitNumber",
          label: "Transit Number",
          placeholder: "5-digit transit number",
          required: true,
        },
        {
          name: "institutionNumber",
          label: "Institution Number",
          placeholder: "3-digit institution number",
          required: true,
        },
        {
          name: "accountNumber",
          label: "Account Number",
          placeholder: "7–12 digit account number",
          required: true,
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. ROYCCAT2",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Chequing", "Savings"],
          required: true,
        },
      ];
    case "AU":
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
          placeholder: "e.g. Commonwealth Bank",
          required: true,
        },
        {
          name: "bsb",
          label: "BSB Number",
          placeholder: "XXX-XXX",
          required: true,
          hint: "6-digit Bank State Branch number",
        },
        {
          name: "accountNumber",
          label: "Account Number",
          placeholder: "6–10 digit account number",
          required: true,
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. CTBAAU2S",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Transaction", "Savings"],
          required: true,
        },
      ];
    case "NG":
      return [
        {
          name: "recipientName",
          label: "Account Holder Full Name",
          placeholder: "John Adeyemi",
          required: true,
        },
        {
          name: "accountNumber",
          label: "Account Number",
          placeholder: "10-digit NUBAN number",
          required: true,
          hint: "Nigerian Uniform Bank Account Number (10 digits)",
        },
        {
          name: "bankName",
          label: "Receiving Bank",
          placeholder: "e.g. GTBank, Access Bank, Zenith",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Savings", "Current", "Domiciliary"],
          required: true,
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. GTBINGLA",
          required: true,
        },
      ];
    case "GH":
      return [
        {
          name: "recipientName",
          label: "Account Holder Full Name",
          placeholder: "Kwame Mensah",
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
          label: "Receiving Bank",
          placeholder: "e.g. GCB Bank, Ecobank Ghana",
          required: true,
        },
        {
          name: "bankCode",
          label: "Bank Code",
          placeholder: "6-digit bank code",
          required: true,
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. GHCBGHAC",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Savings", "Current"],
          required: true,
        },
      ];
    case "KE":
      return [
        {
          name: "recipientName",
          label: "Account Holder Full Name",
          placeholder: "Wanjiku Kamau",
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
          label: "Receiving Bank",
          placeholder: "e.g. Equity Bank, KCB",
          required: true,
        },
        {
          name: "bankCode",
          label: "Bank Code",
          placeholder: "5-digit bank code",
          required: true,
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. EQBLKENA",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Savings", "Current"],
          required: true,
        },
      ];
    case "IN":
      return [
        {
          name: "recipientName",
          label: "Account Holder Full Name",
          placeholder: "Raj Sharma",
          required: true,
        },
        {
          name: "accountNumber",
          label: "Account Number",
          placeholder: "9–18 digit account number",
          required: true,
        },
        {
          name: "bankName",
          label: "Bank Name",
          placeholder: "e.g. HDFC Bank, SBI",
          required: true,
        },
        {
          name: "ifsc",
          label: "IFSC Code",
          placeholder: "e.g. HDFC0001234",
          required: true,
          hint: "11-character Indian Financial System Code",
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. HDFCINBB",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Savings", "Current", "NRE", "NRO"],
          required: true,
        },
      ];
    case "DE":
    case "FR":
    case "IT":
    case "ES":
    case "NL":
    case "BE":
    case "AT":
    case "PT":
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
          options: ["Girokonto (Current)", "Sparkonto (Savings)"],
          required: true,
        },
      ];
    case "JP":
      return [
        {
          name: "recipientName",
          label: "Account Holder Full Name (Katakana)",
          placeholder: "タナカ タロウ",
          required: true,
        },
        {
          name: "bankName",
          label: "Bank Name",
          placeholder: "e.g. Mitsubishi UFJ Bank",
          required: true,
        },
        {
          name: "bankCode",
          label: "Bank Code (金融機関コード)",
          placeholder: "4-digit code",
          required: true,
        },
        {
          name: "branchCode",
          label: "Branch Code (支店コード)",
          placeholder: "3-digit code",
          required: true,
        },
        {
          name: "accountNumber",
          label: "Account Number",
          placeholder: "7-digit account number",
          required: true,
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. BOTKJPJT",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Ordinary (普通)", "Current (当座)"],
          required: true,
        },
      ];
    case "CN":
      return [
        {
          name: "recipientName",
          label: "Account Holder Full Name",
          placeholder: "Li Wei",
          required: true,
        },
        {
          name: "accountNumber",
          label: "Bank Card / Account Number",
          placeholder: "16–19 digit number",
          required: true,
        },
        {
          name: "bankName",
          label: "Bank Name",
          placeholder: "e.g. ICBC, Bank of China",
          required: true,
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. ICBKCNBJ",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Savings (储蓄)", "Current (活期)"],
          required: true,
        },
      ];
    case "ZA":
      return [
        {
          name: "recipientName",
          label: "Account Holder Full Name",
          placeholder: "Sipho Dlamini",
          required: true,
        },
        {
          name: "accountNumber",
          label: "Account Number",
          placeholder: "9–11 digit account number",
          required: true,
        },
        {
          name: "bankName",
          label: "Bank Name",
          placeholder: "e.g. Standard Bank, FNB",
          required: true,
        },
        {
          name: "branchCode",
          label: "Branch Code",
          placeholder: "6-digit universal branch code",
          required: true,
        },
        {
          name: "swiftCode",
          label: "SWIFT/BIC Code",
          placeholder: "e.g. SBZAZAJJ",
          required: true,
        },
        {
          name: "accountType",
          label: "Account Type",
          type: "select",
          options: ["Cheque", "Savings", "Transmission"],
          required: true,
        },
      ];
    default:
      // Generic international
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
