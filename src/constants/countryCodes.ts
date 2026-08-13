export interface CountryCode {
  code: string
  name: string
  flag: string
  iso: string
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: '+84',  name: 'Việt Nam',        flag: '🇻🇳', iso: 'VN' },
  { code: '+1',   name: 'Hoa Kỳ / Canada', flag: '🇺🇸', iso: 'US' },
  { code: '+81',  name: 'Nhật Bản',        flag: '🇯🇵', iso: 'JP' },
  { code: '+82',  name: 'Hàn Quốc',        flag: '🇰🇷', iso: 'KR' },
  { code: '+86',  name: 'Trung Quốc',      flag: '🇨🇳', iso: 'CN' },
  { code: '+44',  name: 'Vương Quốc Anh',  flag: '🇬🇧', iso: 'GB' },
  { code: '+61',  name: 'Úc (Australia)',  flag: '🇦🇺', iso: 'AU' },
  { code: '+65',  name: 'Singapore',       flag: '🇸🇬', iso: 'SG' },
  { code: '+66',  name: 'Thái Lan',        flag: '🇹🇭', iso: 'TH' },
  { code: '+60',  name: 'Malaysia',        flag: '🇲🇾', iso: 'MY' },
  { code: '+62',  name: 'Indonesia',       flag: '🇮🇩', iso: 'ID' },
  { code: '+63',  name: 'Philippines',     flag: '🇵🇭', iso: 'PH' },
  { code: '+855', name: 'Campuchia',       flag: '🇰🇭', iso: 'KH' },
  { code: '+856', name: 'Lào',             flag: '🇱🇦', iso: 'LA' },
  { code: '+852', name: 'Hồng Kông',       flag: '🇭🇰', iso: 'HK' },
  { code: '+886', name: 'Đài Loan',        flag: '🇹🇼', iso: 'TW' },
  { code: '+49',  name: 'Đức',             flag: '🇩🇪', iso: 'DE' },
  { code: '+33',  name: 'Pháp',            flag: '🇫🇷', iso: 'FR' },
  { code: '+39',  name: 'Ý',               flag: '🇮🇹', iso: 'IT' },
  { code: '+7',   name: 'Nga',             flag: '🇷🇺', iso: 'RU' },
  { code: '+91',  name: 'Ấn Độ',           flag: '🇮🇳', iso: 'IN' },
]
