export type ToneType = "none" | "grave" | "acute" | "hook" | "tilde" | "dot";

export type ToneDefinition = {
  id: ToneType;
  name: string;
  symbol: string;
  desc: string;
};

export const VIETNAMESE_TONES: ToneDefinition[] = [
  { id: "none", name: "Không dấu", symbol: "—", desc: "Thanh ngang (bằng phẳng)" },
  { id: "grave", name: "Huyền", symbol: "\\", desc: "Thanh huyền (trầm)" },
  { id: "acute", name: "Sắc", symbol: "/", desc: "Thanh sắc (bổng)" },
  { id: "hook", name: "Hỏi", symbol: "?", desc: "Thanh hỏi (lượn khúc)" },
  { id: "tilde", name: "Ngã", symbol: "~", desc: "Thanh ngã (gãy, nhấn)" },
  { id: "dot", name: "Nặng", symbol: "•", desc: "Thanh nặng (ngắt, đột ngột)" },
];

export type DiacriticCharInfo = {
  upper: string;
  lower: string;
  tone: ToneType;
  toneName: string;
  upperUnicode: string;
  lowerUnicode: string;
  upperName: string;
  lowerName: string;
  accentType: "base" | "circumflex" | "breve" | "horn" | "stroke";
};

export type DiacriticRow = {
  id: string;
  baseChar: string;
  name: string;
  accentType: "base" | "circumflex" | "breve" | "horn" | "stroke";
  chars: DiacriticCharInfo[];
};

export const VIETNAMESE_DIACRITIC_MATRIX: DiacriticRow[] = [
  {
    id: "a-base",
    baseChar: "A",
    name: "A (Nguyên âm cơ bản)",
    accentType: "base",
    chars: [
      { upper: "A", lower: "a", tone: "none", toneName: "Không dấu", upperUnicode: "U+0041", lowerUnicode: "U+0061", upperName: "A hoa", lowerName: "a thường", accentType: "base" },
      { upper: "À", lower: "à", tone: "grave", toneName: "Huyền", upperUnicode: "U+00C0", lowerUnicode: "U+00E0", upperName: "À hoa (huyền)", lowerName: "à thường (huyền)", accentType: "base" },
      { upper: "Á", lower: "á", tone: "acute", toneName: "Sắc", upperUnicode: "U+00C1", lowerUnicode: "U+00E1", upperName: "Á hoa (sắc)", lowerName: "á thường (sắc)", accentType: "base" },
      { upper: "Ả", lower: "ả", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1EA2", lowerUnicode: "U+1EA3", upperName: "Ả hoa (hỏi)", lowerName: "ả thường (hỏi)", accentType: "base" },
      { upper: "Ã", lower: "ã", tone: "tilde", toneName: "Ngã", upperUnicode: "U+00C3", lowerUnicode: "U+00E3", upperName: "Ã hoa (ngã)", lowerName: "ã thường (ngã)", accentType: "base" },
      { upper: "Ạ", lower: "ạ", tone: "dot", toneName: "Nặng", upperUnicode: "U+1EA0", lowerUnicode: "U+1EA1", upperName: "Ạ hoa (nặng)", lowerName: "ạ thường (nặng)", accentType: "base" },
    ],
  },
  {
    id: "a-breve",
    baseChar: "Ă",
    name: "Ă (A dấu trăng / Breve)",
    accentType: "breve",
    chars: [
      { upper: "Ă", lower: "ă", tone: "none", toneName: "Không dấu", upperUnicode: "U+0102", lowerUnicode: "U+0103", upperName: "Ă hoa", lowerName: "ă thường", accentType: "breve" },
      { upper: "Ằ", lower: "ằ", tone: "grave", toneName: "Huyền", upperUnicode: "U+1EB0", lowerUnicode: "U+1EB1", upperName: "Ằ hoa (trăng huyền)", lowerName: "ằ thường (trăng huyền)", accentType: "breve" },
      { upper: "Ắ", lower: "ắ", tone: "acute", toneName: "Sắc", upperUnicode: "U+1EAE", lowerUnicode: "U+1EAF", upperName: "Ắ hoa (trăng sắc)", lowerName: "ắ thường (trăng sắc)", accentType: "breve" },
      { upper: "Ẳ", lower: "ẳ", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1EB2", lowerUnicode: "U+1EB3", upperName: "Ẳ hoa (trăng hỏi)", lowerName: "ẳ thường (trăng hỏi)", accentType: "breve" },
      { upper: "Ẵ", lower: "ẵ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+1EB4", lowerUnicode: "U+1EB5", upperName: "Ẵ hoa (trăng ngã)", lowerName: "ẵ thường (trăng ngã)", accentType: "breve" },
      { upper: "Ặ", lower: "ặ", tone: "dot", toneName: "Nặng", upperUnicode: "U+1EB6", lowerUnicode: "U+1EB7", upperName: "Ặ hoa (trăng nặng)", lowerName: "ặ thường (trăng nặng)", accentType: "breve" },
    ],
  },
  {
    id: "a-circumflex",
    baseChar: "Â",
    name: "Â (A dấu mũ / Circumflex)",
    accentType: "circumflex",
    chars: [
      { upper: "Â", lower: "â", tone: "none", toneName: "Không dấu", upperUnicode: "U+00C2", lowerUnicode: "U+00E2", upperName: "Â hoa", lowerName: "â thường", accentType: "circumflex" },
      { upper: "Ầ", lower: "ầ", tone: "grave", toneName: "Huyền", upperUnicode: "U+1EA6", lowerUnicode: "U+1EA7", upperName: "Ầ hoa (mũ huyền)", lowerName: "ầ thường (mũ huyền)", accentType: "circumflex" },
      { upper: "Ấ", lower: "ấ", tone: "acute", toneName: "Sắc", upperUnicode: "U+1EA4", lowerUnicode: "U+1EA5", upperName: "Ấ hoa (mũ sắc)", lowerName: "ấ thường (mũ sắc)", accentType: "circumflex" },
      { upper: "Ẩ", lower: "ẩ", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1EA8", lowerUnicode: "U+1EA9", upperName: "Ẩ hoa (mũ hỏi)", lowerName: "ẩ thường (mũ hỏi)", accentType: "circumflex" },
      { upper: "Ẫ", lower: "ẫ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+1EAA", lowerUnicode: "U+1EAB", upperName: "Ẫ hoa (mũ ngã)", lowerName: "ẫ thường (mũ ngã)", accentType: "circumflex" },
      { upper: "Ậ", lower: "ậ", tone: "dot", toneName: "Nặng", upperUnicode: "U+1EAC", lowerUnicode: "U+1EAD", upperName: "Ậ hoa (mũ nặng)", lowerName: "ậ thường (mũ nặng)", accentType: "circumflex" },
    ],
  },
  {
    id: "e-base",
    baseChar: "E",
    name: "E (Nguyên âm cơ bản)",
    accentType: "base",
    chars: [
      { upper: "E", lower: "e", tone: "none", toneName: "Không dấu", upperUnicode: "U+0045", lowerUnicode: "U+0065", upperName: "E hoa", lowerName: "e thường", accentType: "base" },
      { upper: "È", lower: "è", tone: "grave", toneName: "Huyền", upperUnicode: "U+00C8", lowerUnicode: "U+00E8", upperName: "È hoa (huyền)", lowerName: "è thường (huyền)", accentType: "base" },
      { upper: "É", lower: "é", tone: "acute", toneName: "Sắc", upperUnicode: "U+00C9", lowerUnicode: "U+00E9", upperName: "É hoa (sắc)", lowerName: "é thường (sắc)", accentType: "base" },
      { upper: "Ẻ", lower: "ẻ", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1EBA", lowerUnicode: "U+1EBB", upperName: "Ẻ hoa (hỏi)", lowerName: "ẻ thường (hỏi)", accentType: "base" },
      { upper: "Ẽ", lower: "ẽ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+1EBC", lowerUnicode: "U+1EBD", upperName: "Ẽ hoa (ngã)", lowerName: "ẽ thường (ngã)", accentType: "base" },
      { upper: "Ẹ", lower: "ẹ", tone: "dot", toneName: "Nặng", upperUnicode: "U+1EB8", lowerUnicode: "U+1EB9", upperName: "Ẹ hoa (nặng)", lowerName: "ẹ thường (nặng)", accentType: "base" },
    ],
  },
  {
    id: "e-circumflex",
    baseChar: "Ê",
    name: "Ê (E dấu mũ / Circumflex)",
    accentType: "circumflex",
    chars: [
      { upper: "Ê", lower: "ê", tone: "none", toneName: "Không dấu", upperUnicode: "U+00CA", lowerUnicode: "U+00EA", upperName: "Ê hoa", lowerName: "ê thường", accentType: "circumflex" },
      { upper: "Ề", lower: "ề", tone: "grave", toneName: "Huyền", upperUnicode: "U+1EC0", lowerUnicode: "U+1EC1", upperName: "Ề hoa (mũ huyền)", lowerName: "ề thường (mũ huyền)", accentType: "circumflex" },
      { upper: "Ế", lower: "ế", tone: "acute", toneName: "Sắc", upperUnicode: "U+1EBE", lowerUnicode: "U+1EBF", upperName: "Ế hoa (mũ sắc)", lowerName: "ế thường (mũ sắc)", accentType: "circumflex" },
      { upper: "Ể", lower: "ể", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1EC2", lowerUnicode: "U+1EC3", upperName: "Ể hoa (mũ hỏi)", lowerName: "ể thường (mũ hỏi)", accentType: "circumflex" },
      { upper: "Ễ", lower: "ễ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+1EC4", lowerUnicode: "U+1EC5", upperName: "Ễ hoa (mũ ngã)", lowerName: "ễ thường (mũ ngã)", accentType: "circumflex" },
      { upper: "Ệ", lower: "ệ", tone: "dot", toneName: "Nặng", upperUnicode: "U+1EC6", lowerUnicode: "U+1EC7", upperName: "Ệ hoa (mũ nặng)", lowerName: "ệ thường (mũ nặng)", accentType: "circumflex" },
    ],
  },
  {
    id: "i-base",
    baseChar: "I",
    name: "I (Nguyên âm cơ bản)",
    accentType: "base",
    chars: [
      { upper: "I", lower: "i", tone: "none", toneName: "Không dấu", upperUnicode: "U+0049", lowerUnicode: "U+0069", upperName: "I hoa", lowerName: "i thường", accentType: "base" },
      { upper: "Ì", lower: "ì", tone: "grave", toneName: "Huyền", upperUnicode: "U+00CC", lowerUnicode: "U+00EC", upperName: "Ì hoa (huyền)", lowerName: "ì thường (huyền)", accentType: "base" },
      { upper: "Í", lower: "í", tone: "acute", toneName: "Sắc", upperUnicode: "U+00CD", lowerUnicode: "U+00ED", upperName: "Í hoa (sắc)", lowerName: "í thường (sắc)", accentType: "base" },
      { upper: "Ỉ", lower: "ỉ", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1EC8", lowerUnicode: "U+1EC9", upperName: "Ỉ hoa (hỏi)", lowerName: "ỉ thường (hỏi)", accentType: "base" },
      { upper: "Ĩ", lower: "ĩ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+0128", lowerUnicode: "U+0129", upperName: "Ĩ hoa (ngã)", lowerName: "ĩ thường (ngã)", accentType: "base" },
      { upper: "Ị", lower: "ị", tone: "dot", toneName: "Nặng", upperUnicode: "U+1ECA", lowerUnicode: "U+1ECB", upperName: "Ị hoa (nặng)", lowerName: "ị thường (nặng)", accentType: "base" },
    ],
  },
  {
    id: "o-base",
    baseChar: "O",
    name: "O (Nguyên âm tròn cơ bản)",
    accentType: "base",
    chars: [
      { upper: "O", lower: "o", tone: "none", toneName: "Không dấu", upperUnicode: "U+004F", lowerUnicode: "U+006F", upperName: "O hoa", lowerName: "o thường", accentType: "base" },
      { upper: "Ò", lower: "ò", tone: "grave", toneName: "Huyền", upperUnicode: "U+00D2", lowerUnicode: "U+00F2", upperName: "Ò hoa (huyền)", lowerName: "ò thường (huyền)", accentType: "base" },
      { upper: "Ó", lower: "ó", tone: "acute", toneName: "Sắc", upperUnicode: "U+00D3", lowerUnicode: "U+00F3", upperName: "Ó hoa (sắc)", lowerName: "ó thường (sắc)", accentType: "base" },
      { upper: "Ỏ", lower: "ỏ", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1ECE", lowerUnicode: "U+1ECF", upperName: "Ỏ hoa (hỏi)", lowerName: "ỏ thường (hỏi)", accentType: "base" },
      { upper: "Õ", lower: "õ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+00D5", lowerUnicode: "U+00F5", upperName: "Õ hoa (ngã)", lowerName: "õ thường (ngã)", accentType: "base" },
      { upper: "Ọ", lower: "ọ", tone: "dot", toneName: "Nặng", upperUnicode: "U+1ECC", lowerUnicode: "U+1ECD", upperName: "Ọ hoa (nặng)", lowerName: "ọ thường (nặng)", accentType: "base" },
    ],
  },
  {
    id: "o-circumflex",
    baseChar: "Ô",
    name: "Ô (O dấu mũ / Circumflex)",
    accentType: "circumflex",
    chars: [
      { upper: "Ô", lower: "ô", tone: "none", toneName: "Không dấu", upperUnicode: "U+00D4", lowerUnicode: "U+00F4", upperName: "Ô hoa", lowerName: "ô thường", accentType: "circumflex" },
      { upper: "Ồ", lower: "ồ", tone: "grave", toneName: "Huyền", upperUnicode: "U+1ED2", lowerUnicode: "U+1ED3", upperName: "Ồ hoa (mũ huyền)", lowerName: "ồ thường (mũ huyền)", accentType: "circumflex" },
      { upper: "Ố", lower: "ố", tone: "acute", toneName: "Sắc", upperUnicode: "U+1ED0", lowerUnicode: "U+1ED1", upperName: "Ố hoa (mũ sắc)", lowerName: "ố thường (mũ sắc)", accentType: "circumflex" },
      { upper: "Ổ", lower: "ổ", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1ED4", lowerUnicode: "U+1ED5", upperName: "Ổ hoa (mũ hỏi)", lowerName: "ổ thường (mũ hỏi)", accentType: "circumflex" },
      { upper: "Ỗ", lower: "ỗ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+1ED6", lowerUnicode: "U+1ED7", upperName: "Ỗ hoa (mũ ngã)", lowerName: "ỗ thường (mũ ngã)", accentType: "circumflex" },
      { upper: "Ộ", lower: "ộ", tone: "dot", toneName: "Nặng", upperUnicode: "U+1ED8", lowerUnicode: "U+1ED9", upperName: "Ộ hoa (mũ nặng)", lowerName: "ộ thường (mũ nặng)", accentType: "circumflex" },
    ],
  },
  {
    id: "o-horn",
    baseChar: "Ơ",
    name: "Ơ (O dấu móc / Horn)",
    accentType: "horn",
    chars: [
      { upper: "Ơ", lower: "ơ", tone: "none", toneName: "Không dấu", upperUnicode: "U+01A0", lowerUnicode: "U+01A1", upperName: "Ơ hoa", lowerName: "ơ thường", accentType: "horn" },
      { upper: "Ờ", lower: "ờ", tone: "grave", toneName: "Huyền", upperUnicode: "U+1EDC", lowerUnicode: "U+1EDD", upperName: "Ờ hoa (móc huyền)", lowerName: "ờ thường (móc huyền)", accentType: "horn" },
      { upper: "Ớ", lower: "ớ", tone: "acute", toneName: "Sắc", upperUnicode: "U+1EDA", lowerUnicode: "U+1EDB", upperName: "Ớ hoa (móc sắc)", lowerName: "ớ thường (móc sắc)", accentType: "horn" },
      { upper: "Ở", lower: "ở", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1EDE", lowerUnicode: "U+1EDF", upperName: "Ở hoa (móc hỏi)", lowerName: "ở thường (móc hỏi)", accentType: "horn" },
      { upper: "Ỡ", lower: "ỡ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+1EE0", lowerUnicode: "U+1EE1", upperName: "Ỡ hoa (móc ngã)", lowerName: "ỡ thường (móc ngã)", accentType: "horn" },
      { upper: "Ợ", lower: "ợ", tone: "dot", toneName: "Nặng", upperUnicode: "U+1EE2", lowerUnicode: "U+1EE3", upperName: "Ợ hoa (móc nặng)", lowerName: "ợ thường (móc nặng)", accentType: "horn" },
    ],
  },
  {
    id: "u-base",
    baseChar: "U",
    name: "U (Nguyên âm cơ bản)",
    accentType: "base",
    chars: [
      { upper: "U", lower: "u", tone: "none", toneName: "Không dấu", upperUnicode: "U+0055", lowerUnicode: "U+0075", upperName: "U hoa", lowerName: "u thường", accentType: "base" },
      { upper: "Ù", lower: "ù", tone: "grave", toneName: "Huyền", upperUnicode: "U+00D9", lowerUnicode: "U+00F9", upperName: "Ù hoa (huyền)", lowerName: "ù thường (huyền)", accentType: "base" },
      { upper: "Ú", lower: "ú", tone: "acute", toneName: "Sắc", upperUnicode: "U+00DA", lowerUnicode: "U+00FA", upperName: "Ú hoa (sắc)", lowerName: "ú thường (sắc)", accentType: "base" },
      { upper: "Ủ", lower: "ủ", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1EE6", lowerUnicode: "U+1EE7", upperName: "Ủ hoa (hỏi)", lowerName: "ủ thường (hỏi)", accentType: "base" },
      { upper: "Ũ", lower: "ũ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+0168", lowerUnicode: "U+0169", upperName: "Ũ hoa (ngã)", lowerName: "ũ thường (ngã)", accentType: "base" },
      { upper: "Ụ", lower: "ụ", tone: "dot", toneName: "Nặng", upperUnicode: "U+1EE4", lowerUnicode: "U+1EE5", upperName: "Ụ hoa (nặng)", lowerName: "ụ thường (nặng)", accentType: "base" },
    ],
  },
  {
    id: "u-horn",
    baseChar: "Ư",
    name: "Ư (U dấu móc / Horn)",
    accentType: "horn",
    chars: [
      { upper: "Ư", lower: "ư", tone: "none", toneName: "Không dấu", upperUnicode: "U+01AF", lowerUnicode: "U+01B0", upperName: "Ư hoa", lowerName: "ư thường", accentType: "horn" },
      { upper: "Ừ", lower: "ừ", tone: "grave", toneName: "Huyền", upperUnicode: "U+1EEA", lowerUnicode: "U+1EEB", upperName: "Ừ hoa (móc huyền)", lowerName: "ừ thường (móc huyền)", accentType: "horn" },
      { upper: "Ứ", lower: "ứ", tone: "acute", toneName: "Sắc", upperUnicode: "U+1EE8", lowerUnicode: "U+1EE9", upperName: "Ứ hoa (móc sắc)", lowerName: "ứ thường (móc sắc)", accentType: "horn" },
      { upper: "Ử", lower: "ử", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1EEC", lowerUnicode: "U+1EED", upperName: "Ử hoa (móc hỏi)", lowerName: "ử thường (móc hỏi)", accentType: "horn" },
      { upper: "Ữ", lower: "ữ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+1EEE", lowerUnicode: "U+1EEF", upperName: "Ữ hoa (móc ngã)", lowerName: "ữ thường (móc ngã)", accentType: "horn" },
      { upper: "Ự", lower: "ự", tone: "dot", toneName: "Nặng", upperUnicode: "U+1EF0", lowerUnicode: "U+1EF1", upperName: "Ự hoa (móc nặng)", lowerName: "ự thường (móc nặng)", accentType: "horn" },
    ],
  },
  {
    id: "y-base",
    baseChar: "Y",
    name: "Y (Nguyên âm đuôi)",
    accentType: "base",
    chars: [
      { upper: "Y", lower: "y", tone: "none", toneName: "Không dấu", upperUnicode: "U+0059", lowerUnicode: "U+0079", upperName: "Y hoa", lowerName: "y thường", accentType: "base" },
      { upper: "Ỳ", lower: "ỳ", tone: "grave", toneName: "Huyền", upperUnicode: "U+1EF2", lowerUnicode: "U+1EF3", upperName: "Ỳ hoa (huyền)", lowerName: "ỳ thường (huyền)", accentType: "base" },
      { upper: "Ý", lower: "ý", tone: "acute", toneName: "Sắc", upperUnicode: "U+00DD", lowerUnicode: "U+00FD", upperName: "Ý hoa (sắc)", lowerName: "ý thường (sắc)", accentType: "base" },
      { upper: "Ỷ", lower: "ỷ", tone: "hook", toneName: "Hỏi", upperUnicode: "U+1EF6", lowerUnicode: "U+1EF7", upperName: "Ỷ hoa (hỏi)", lowerName: "ỷ thường (hỏi)", accentType: "base" },
      { upper: "Ỹ", lower: "ỹ", tone: "tilde", toneName: "Ngã", upperUnicode: "U+1EF8", lowerUnicode: "U+1EF9", upperName: "Ỹ hoa (ngã)", lowerName: "ỹ thường (ngã)", accentType: "base" },
      { upper: "Ỵ", lower: "ỵ", tone: "dot", toneName: "Nặng", upperUnicode: "U+1EF4", lowerUnicode: "U+1EF5", upperName: "Ỵ hoa (nặng)", lowerName: "ỵ thường (nặng)", accentType: "base" },
    ],
  },
  {
    id: "d-stroke",
    baseChar: "Đ",
    name: "Đ (Phụ âm có gạch / Stroke)",
    accentType: "stroke",
    chars: [
      { upper: "D", lower: "d", tone: "none", toneName: "Không dấu", upperUnicode: "U+0044", lowerUnicode: "U+0064", upperName: "D hoa cơ bản", lowerName: "d thường cơ bản", accentType: "base" },
      { upper: "Đ", lower: "đ", tone: "dot", toneName: "Gạch ngang", upperUnicode: "U+0110", lowerUnicode: "U+0111", upperName: "Đ hoa có gạch", lowerName: "đ thường có gạch", accentType: "stroke" },
    ],
  },
];

export type StressTestCase = {
  id: string;
  category: string;
  description: string;
  words: string[];
  sentence: string;
};

export const STRESS_TEST_CASES: StressTestCase[] = [
  {
    id: "stacked-horns",
    category: "Dấu Móc & Dấu Mũ Kép",
    description: "Kiểm tra va chạm giữa dấu thanh (hỏi, ngã, sắc, huyền) và dấu phụ (mũ, móc, trăng).",
    words: [
      "Khỏe khoắn",
      "Phở bò",
      "Cổ thụ",
      "Cửa sổ",
      "Lượn lờ",
      "Bận rộn",
      "Quằn quại",
      "Rực rỡ",
      "Thuyền trưởng",
      "Ngọn lửa",
      "Kỷ nghệ",
    ],
    sentence: "Trời thu xanh ngắt mấy tầng cao, cần trúc lơ phơ gió hắt hiu.",
  },
  {
    id: "dot-below",
    category: "Dấu Nặng & Chân Chữ (Dot Below)",
    description: "Kiểm tra khoảng cách dấu nặng với đường chân chữ và các ký tự có đuôi (y, g, p).",
    words: [
      "Đà Lạt",
      "Đường đời",
      "Địa đạo",
      "Đồng khởi",
      "Trực nhật",
      "Thực thụ",
      "Ngập tràn",
      "Kỳ lạ",
      "Kỵ binh",
      "Vọng nguyệt",
    ],
    sentence: "Đất nước bốn ngàn năm lịch sử, ngập tràn sức sống kiên cường và rực rỡ.",
  },
  {
    id: "tall-caps",
    category: "Chữ Hoa Có Dấu (Accented Capitals)",
    description: "Kiểm tra dấu trên chữ hoa có vượt quá trần dòng (line-height) gây đè lên dòng trên không.",
    words: [
      "ẤN TƯỢNG",
      "ỦY BAN",
      "ĐẠI HỌC",
      "Ý CHÍ",
      "ỔN ĐỊNH",
      "ẨM THỰC",
      "Ở ĐÂY",
      "ỰC NƯỚC",
      "Ể HẢ",
    ],
    sentence: "VIỆT NAM ĐỘC LẬP TỰ DO HẠNH PHÚC — NƯỚC CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM.",
  },
  {
    id: "classic-poetry",
    category: "Văn bản & Đoạn văn Thực tế",
    description: "Thẩm định nhịp điệu (typographic rhythm), độ thoáng mắt và khoảng cách từ.",
    words: [
      "Nguyện cầu",
      "Thuở ấy",
      "Khoảng lặng",
      "Hoàng hôn",
      "Nghiêng ngả",
      "Khuya khoắt",
    ],
    sentence:
      "Việt Nam đất nước ta ơi, mênh mông biển lúa đâu trời đẹp hơn. Cánh cò bay lả dập dờn, mây mờ che đỉnh Trường Sơn sớm chiều.",
  },
];
