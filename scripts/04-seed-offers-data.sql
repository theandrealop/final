-- ╔════════════════════════════════════════════════════════════════════════╗
-- ║  Punti Furbi • SAMPLE FLIGHT OFFERS                                   ║
-- ║  Run this after creating the offers table.                            ║
-- ╚════════════════════════════════════════════════════════════════════════╝

INSERT INTO public.offers (
  origin, destination, country, price, original_price, discount, 
  dates, airline, stops, duration, description, image_url, status, valid_until
) VALUES 
-- Italian destinations
('Milano', 'Roma', 'Italia', 89.99, 149.99, 40, '15-30 Gen 2025', 'ITA Airways', 'Diretto', '1h 20m', 'Volo diretto per la capitale italiana', 'photo-1552832230-c0197dd311b5', 'active', '2025-01-30 23:59:59'),
('Roma', 'Napoli', 'Italia', 59.99, 99.99, 40, '20-28 Gen 2025', 'Volotea', 'Diretto', '1h 10m', 'Scopri la bellezza del Sud Italia', 'photo-1534445538923-ab38438550d5', 'active', '2025-01-28 23:59:59'),
('Milano', 'Palermo', 'Italia', 119.99, 199.99, 40, '10-25 Feb 2025', 'Ryanair', '1 scalo', '3h 45m', 'Vola in Sicilia con un ottimo prezzo', 'photo-1539650116574-75c0c6d73f6e', 'active', '2025-02-25 23:59:59'),
('Roma', 'Bari', 'Italia', 99.99, 159.99, 38, '5-20 Feb 2025', 'easyJet', 'Diretto', '2h 15m', 'Puglia ti aspetta!', 'photo-1578662996442-48f60103fc96', 'active', '2025-02-20 23:59:59'),

-- European destinations
('Milano', 'Parigi', 'Francia', 149.99, 249.99, 40, '1-15 Feb 2025', 'Air France', 'Diretto', '2h 5m', 'La città dell''amore ti aspetta', 'photo-1502602898536-47ad22581b52', 'active', '2025-02-15 23:59:59'),
('Roma', 'Barcellona', 'Spagna', 129.99, 219.99, 41, '12-28 Feb 2025', 'Vueling', 'Diretto', '2h 30m', 'Scopri la magia catalana', 'photo-1539037116277-4db20889f2d4', 'active', '2025-02-28 23:59:59'),
('Milano', 'Amsterdam', 'Paesi Bassi', 169.99, 279.99, 39, '8-22 Feb 2025', 'KLM', 'Diretto', '2h 15m', 'I canali di Amsterdam ti chiamano', 'photo-1534351590666-13e3e96b5017', 'active', '2025-02-22 23:59:59'),
('Roma', 'Londra', 'Regno Unito', 189.99, 299.99, 37, '15-30 Mar 2025', 'British Airways', 'Diretto', '2h 45m', 'Esplora la capitale britannica', 'photo-1513635269975-59663e0ac1ad', 'active', '2025-03-30 23:59:59'),
('Milano', 'Berlino', 'Germania', 159.99, 249.99, 36, '20 Feb - 5 Mar 2025', 'Lufthansa', 'Diretto', '2h 10m', 'Storia e cultura nella capitale tedesca', 'photo-1587330979470-3016b6702d89', 'active', '2025-03-05 23:59:59'),
('Roma', 'Vienna', 'Austria', 139.99, 229.99, 39, '10-25 Mar 2025', 'Austrian Airlines', 'Diretto', '2h 20m', 'L''eleganza imperiale austriaca', 'photo-1516550893923-42d28e5677af', 'active', '2025-03-25 23:59:59'),

-- Long-haul destinations
('Milano', 'New York', 'Stati Uniti', 599.99, 899.99, 33, '1-15 Apr 2025', 'Delta Airlines', '1 scalo', '10h 30m', 'La Grande Mela ti aspetta!', 'photo-1496442226666-8d4d0e62e6e9', 'active', '2025-04-15 23:59:59'),
('Roma', 'Tokyo', 'Giappone', 749.99, 1199.99, 38, '5-20 Apr 2025', 'ANA', '1 scalo', '13h 45m', 'Immergiti nella cultura giapponese', 'photo-1540959733332-eab4deabeeaf', 'active', '2025-04-20 23:59:59'),
('Milano', 'Dubai', 'Emirati Arabi', 449.99, 699.99, 36, '15 Mar - 1 Apr 2025', 'Emirates', 'Diretto', '6h 30m', 'Lusso e modernità nel deserto', 'photo-1512453979798-5ea266f8880c', 'active', '2025-04-01 23:59:59'),
('Roma', 'Bangkok', 'Tailandia', 679.99, 999.99, 32, '20 Mar - 5 Apr 2025', 'Thai Airways', '1 scalo', '12h 15m', 'Templi, spiagge e street food', 'photo-1506905925346-21bda4d32df4', 'active', '2025-04-05 23:59:59'),

-- Budget European destinations
('Milano', 'Budapest', 'Ungheria', 89.99, 149.99, 40, '25 Feb - 10 Mar 2025', 'Wizz Air', 'Diretto', '1h 45m', 'Terme e architettura ungherese', 'photo-1541849546-216549ae216d', 'active', '2025-03-10 23:59:59'),
('Roma', 'Praga', 'Repubblica Ceca', 99.99, 169.99, 41, '1-15 Mar 2025', 'Ryanair', 'Diretto', '2h 5m', 'La città delle cento torri', 'photo-1541849546-216549ae216d', 'active', '2025-03-15 23:59:59'),
('Milano', 'Cracovia', 'Polonia', 79.99, 139.99, 43, '10-25 Mar 2025', 'Ryanair', 'Diretto', '2h 15m', 'Storia medievale polacca', 'photo-1578662996442-48f60103fc96', 'active', '2025-03-25 23:59:59'),
('Roma', 'Atene', 'Grecia', 119.99, 199.99, 40, '15-30 Mar 2025', 'Aegean Airlines', 'Diretto', '2h 10m', 'Culla della civiltà occidentale', 'photo-1555993539-1732b0258235', 'active', '2025-03-30 23:59:59'),

-- Some terminated offers for testing
('Milano', 'Madrid', 'Spagna', 99.99, 179.99, 44, '1-15 Gen 2025', 'Iberia', 'Diretto', '2h 15m', 'Offerta scaduta per Madrid', 'photo-1539037116277-4db20889f2d4', 'terminated', '2025-01-15 23:59:59'),
('Roma', 'Lisbona', 'Portogallo', 129.99, 199.99, 35, '10-25 Gen 2025', 'TAP Air Portugal', 'Diretto', '2h 45m', 'Offerta scaduta per Lisbona', 'photo-1555881400-74d7acaacd8b', 'terminated', '2025-01-25 23:59:59');
