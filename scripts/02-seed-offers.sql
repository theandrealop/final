-- Insert sample flight offers
INSERT INTO public.offers (
  origin, destination, country, price, original_price, discount, 
  dates, airline, stops, duration, description, status, valid_until
) VALUES 
-- From Rome
(
  'Roma', 'Parigi', 'Francia', 89.99, 199.99, 55,
  '15-30 Marzo 2024', 'Ryanair', 'Diretto', '2h 15m',
  'Volo diretto per la città dell''amore. Include bagaglio a mano.',
  'active', '2024-03-01 23:59:59'
),
(
  'Roma', 'Barcellona', 'Spagna', 79.99, 159.99, 50,
  '20-25 Marzo 2024', 'Vueling', 'Diretto', '1h 45m',
  'Scopri la vibrante capitale catalana con questo volo super conveniente.',
  'active', '2024-03-05 23:59:59'
),
(
  'Roma', 'Londra', 'Regno Unito', 119.99, 249.99, 52,
  '10-20 Aprile 2024', 'EasyJet', 'Diretto', '2h 40m',
  'Vola nella capitale britannica. Perfetto per un weekend lungo.',
  'active', '2024-04-01 23:59:59'
),
(
  'Roma', 'Amsterdam', 'Paesi Bassi', 99.99, 189.99, 47,
  '5-15 Maggio 2024', 'KLM', 'Diretto', '2h 20m',
  'Esplora i canali e i musei di Amsterdam con questa offerta imperdibile.',
  'active', '2024-04-20 23:59:59'
),

-- From Milan
(
  'Milano', 'Vienna', 'Austria', 69.99, 149.99, 53,
  '25 Marzo - 5 Aprile 2024', 'Austrian Airlines', 'Diretto', '1h 30m',
  'Immergiti nella cultura imperiale di Vienna. Volo diretto da Malpensa.',
  'active', '2024-03-15 23:59:59'
),
(
  'Milano', 'Berlino', 'Germania', 89.99, 179.99, 50,
  '1-15 Aprile 2024', 'Lufthansa', 'Diretto', '1h 50m',
  'Scopri la storia e la modernità di Berlino. Include snack a bordo.',
  'active', '2024-03-25 23:59:59'
),
(
  'Milano', 'Praga', 'Repubblica Ceca', 79.99, 169.99, 53,
  '10-25 Aprile 2024', 'Czech Airlines', 'Diretto', '1h 40m',
  'La città delle cento torri ti aspetta. Volo diretto da Linate.',
  'active', '2024-04-05 23:59:59'
),
(
  'Milano', 'Zurigo', 'Svizzera', 109.99, 199.99, 45,
  '15-30 Aprile 2024', 'Swiss International', 'Diretto', '1h 20m',
  'Breve volo per la Svizzera. Perfetto per shopping e relax.',
  'active', '2024-04-10 23:59:59'
),

-- From Naples
(
  'Napoli', 'Madrid', 'Spagna', 94.99, 189.99, 50,
  '20 Marzo - 5 Aprile 2024', 'Iberia', 'Diretto', '2h 10m',
  'Dalla pizza alla paella! Volo diretto per la capitale spagnola.',
  'active', '2024-03-10 23:59:59'
),
(
  'Napoli', 'Atene', 'Grecia', 84.99, 164.99, 48,
  '25 Marzo - 10 Aprile 2024', 'Aegean Airlines', 'Diretto', '1h 45m',
  'Esplora la culla della civiltà occidentale. Volo diretto.',
  'active', '2024-03-20 23:59:59'
),

-- From Venice
(
  'Venezia', 'Istanbul', 'Turchia', 129.99, 259.99, 50,
  '1-20 Aprile 2024', 'Turkish Airlines', 'Diretto', '2h 30m',
  'Dalla Serenissima alla Sublime Porta. Un viaggio tra due mondi.',
  'active', '2024-03-25 23:59:59'
),
(
  'Venezia', 'Dublino', 'Irlanda', 119.99, 229.99, 48,
  '5-25 Aprile 2024', 'Aer Lingus', '1 scalo', '4h 20m',
  'Scopri l''Irlanda partendo dalla romantica Venezia.',
  'active', '2024-04-01 23:59:59'
),

-- From Florence
(
  'Firenze', 'Nizza', 'Francia', 74.99, 144.99, 48,
  '15 Marzo - 1 Aprile 2024', 'Air France', 'Diretto', '1h 30m',
  'Dal Rinascimento alla Costa Azzurra. Volo diretto.',
  'active', '2024-03-05 23:59:59'
),

-- From Bologna
(
  'Bologna', 'Monaco di Baviera', 'Germania', 89.99, 169.99, 47,
  '20 Marzo - 10 Aprile 2024', 'Lufthansa', 'Diretto', '1h 35m',
  'Dalla città delle torri alla capitale bavarese.',
  'active', '2024-03-15 23:59:59'
),

-- Long-haul deals
(
  'Roma', 'New York', 'Stati Uniti', 399.99, 799.99, 50,
  '1-30 Maggio 2024', 'Delta Airlines', '1 scalo', '10h 30m',
  'La Grande Mela ti aspetta! Volo con scalo ad Amsterdam.',
  'active', '2024-04-15 23:59:59'
),
(
  'Milano', 'Tokyo', 'Giappone', 549.99, 999.99, 45,
  '10 Maggio - 10 Giugno 2024', 'ANA', '1 scalo', '13h 45m',
  'Scopri il Giappone partendo da Milano. Scalo a Francoforte.',
  'active', '2024-04-30 23:59:59'
),

-- Italian destinations
('Milano', 'Roma', 'Italia', 89.99, 149.99, 40, '15-30 Gen 2025', 'ITA Airways', 'Diretto', '1h 20m', 'Volo diretto per la capitale italiana', 'active', '2025-01-30 23:59:59'),
('Roma', 'Napoli', 'Italia', 59.99, 99.99, 40, '20-28 Gen 2025', 'Volotea', 'Diretto', '1h 10m', 'Scopri la bellezza del Sud Italia', 'active', '2025-01-28 23:59:59'),
('Milano', 'Palermo', 'Italia', 119.99, 199.99, 40, '10-25 Feb 2025', 'Ryanair', '1 scalo', '3h 45m', 'Vola in Sicilia con un ottimo prezzo', 'active', '2025-02-25 23:59:59'),
('Torino', 'Bari', 'Italia', 99.99, 159.99, 38, '5-20 Feb 2025', 'easyJet', 'Diretto', '2h 15m', 'Puglia ti aspetta!', 'active', '2025-02-20 23:59:59'),

-- European destinations
('Milano', 'Parigi', 'Francia', 149.99, 249.99, 40, '1-15 Feb 2025', 'Air France', 'Diretto', '2h 5m', 'La città dell''amore ti aspetta', 'active', '2025-02-15 23:59:59'),
('Roma', 'Barcellona', 'Spagna', 129.99, 219.99, 41, '12-28 Feb 2025', 'Vueling', 'Diretto', '2h 30m', 'Scopri la magia catalana', 'active', '2025-02-28 23:59:59'),
('Milano', 'Amsterdam', 'Paesi Bassi', 169.99, 279.99, 39, '8-22 Feb 2025', 'KLM', 'Diretto', '2h 15m', 'I canali di Amsterdam ti chiamano', 'active', '2025-02-22 23:59:59'),
('Roma', 'Londra', 'Regno Unito', 189.99, 299.99, 37, '15-30 Mar 2025', 'British Airways', 'Diretto', '2h 45m', 'Esplora la capitale britannica', 'active', '2025-03-30 23:59:59'),
('Milano', 'Berlino', 'Germania', 159.99, 249.99, 36, '20 Feb - 5 Mar 2025', 'Lufthansa', 'Diretto', '2h 10m', 'Storia e cultura nella capitale tedesca', 'active', '2025-03-05 23:59:59'),
('Roma', 'Vienna', 'Austria', 139.99, 229.99, 39, '10-25 Mar 2025', 'Austrian Airlines', 'Diretto', '2h 20m', 'L''eleganza imperiale austriaca', 'active', '2025-03-25 23:59:59'),

-- Long-haul destinations
('Milano', 'New York', 'Stati Uniti', 599.99, 899.99, 33, '1-15 Apr 2025', 'Delta Airlines', '1 scalo', '10h 30m', 'La Grande Mela ti aspetta!', 'active', '2025-04-15 23:59:59'),
('Roma', 'Tokyo', 'Giappone', 749.99, 1199.99, 38, '5-20 Apr 2025', 'ANA', '1 scalo', '13h 45m', 'Immergiti nella cultura giapponese', 'active', '2025-04-20 23:59:59'),
('Milano', 'Dubai', 'Emirati Arabi', 449.99, 699.99, 36, '15 Mar - 1 Apr 2025', 'Emirates', 'Diretto', '6h 30m', 'Lusso e modernità nel deserto', 'active', '2025-04-01 23:59:59'),
('Roma', 'Bangkok', 'Tailandia', 679.99, 999.99, 32, '20 Mar - 5 Apr 2025', 'Thai Airways', '1 scalo', '12h 15m', 'Templi, spiagge e street food', 'active', '2025-04-05 23:59:59'),

-- Budget European destinations
('Milano', 'Budapest', 'Ungheria', 89.99, 149.99, 40, '25 Feb - 10 Mar 2025', 'Wizz Air', 'Diretto', '1h 45m', 'Terme e architettura ungherese', 'active', '2025-03-10 23:59:59'),
('Roma', 'Praga', 'Repubblica Ceca', 99.99, 169.99, 41, '1-15 Mar 2025', 'Ryanair', 'Diretto', '2h 5m', 'La città delle cento torri', 'active', '2025-03-15 23:59:59'),
('Milano', 'Cracovia', 'Polonia', 79.99, 139.99, 43, '10-25 Mar 2025', 'Ryanair', 'Diretto', '2h 15m', 'Storia medievale polacca', 'active', '2025-03-25 23:59:59'),
('Roma', 'Atene', 'Grecia', 119.99, 199.99, 40, '15-30 Mar 2025', 'Aegean Airlines', 'Diretto', '2h 10m', 'Culla della civiltà occidentale', 'active', '2025-03-30 23:59:59');

-- Insert some terminated offers for testing
INSERT INTO public.offers (
  origin, destination, country, price, original_price, discount, 
  dates, airline, stops, duration, description, status, valid_until
) VALUES 
(
  'Roma', 'Lisbona', 'Portogallo', 69.99, 139.99, 50,
  '1-15 Marzo 2024', 'TAP Air Portugal', 'Diretto', '2h 30m',
  'Offerta scaduta per Lisbona.',
  'terminated', '2024-02-28 23:59:59'
),
(
  'Milano', 'Copenhagen', 'Danimarca', 99.99, 199.99, 50,
  '5-20 Marzo 2024', 'SAS', 'Diretto', '2h 15m',
  'Offerta scaduta per Copenhagen.',
  'terminated', '2024-03-01 23:59:59'
);
