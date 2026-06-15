"""
Commande Django pour creer des donnees de test.
Usage : python manage.py seed_data

Images et prix tires de boutiques senegalaises reelles :
- nova.sn  (images publiques, categories verifiees)
- csb.sn   (prix de reference marche dakarois)
"""
import urllib.request
from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from django.utils.text import slugify
from categories.models import Category
from brands.models import Brand
from products.models import Product, ProductImage


CATEGORIES = [
    {
        'name': 'Smartphones & Telephonie',
        'slug': 'smartphones-telephonie',
        'icon': 'Smartphone', 'order': 1,
        'image_url': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop&q=80',
        'children': [
            {'name': 'Smartphones', 'slug': 'smartphones', 'icon': 'Smartphone', 'order': 1},
            {'name': 'Telephones basiques', 'slug': 'telephones-basiques', 'icon': 'Phone', 'order': 2},
            {'name': 'Accessoires telephone', 'slug': 'accessoires-telephone', 'icon': 'Headphones', 'order': 3},
        ],
    },
    {
        'name': 'Informatique',
        'slug': 'informatique',
        'icon': 'Laptop', 'order': 2,
        'image_url': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop&q=80',
        'children': [
            {'name': 'Ordinateurs portables', 'slug': 'ordinateurs-portables', 'icon': 'Laptop', 'order': 1},
            {'name': 'Ordinateurs de bureau', 'slug': 'ordinateurs-bureau', 'icon': 'Monitor', 'order': 2},
            {'name': 'Tablettes', 'slug': 'tablettes', 'icon': 'Tablet', 'order': 3},
            {'name': 'Accessoires PC', 'slug': 'accessoires-pc', 'icon': 'Mouse', 'order': 4},
        ],
    },
    {
        'name': 'Electromenager',
        'slug': 'electromenager',
        'icon': 'Refrigerator', 'order': 3,
        'image_url': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
        'children': [
            {'name': 'Refrigerateurs', 'slug': 'refrigerateurs', 'icon': 'Refrigerator', 'order': 1},
            {'name': 'Machines a laver', 'slug': 'machines-laver', 'icon': 'WashingMachine', 'order': 2},
            {'name': 'Climatiseurs', 'slug': 'climatiseurs', 'icon': 'Wind', 'order': 3},
            {'name': 'Televiseurs', 'slug': 'televiseurs', 'icon': 'Tv', 'order': 4},
            {'name': 'Petits electromenagers', 'slug': 'petits-electromenagers', 'icon': 'Zap', 'order': 5},
            {'name': 'Onduleurs & Solaire', 'slug': 'onduleurs-solaire', 'icon': 'Sun', 'order': 6},
        ],
    },
    {
        'name': 'Audio & Video',
        'slug': 'audio-video',
        'icon': 'Speaker', 'order': 4,
        'image_url': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=400&fit=crop&q=80',
        'children': [
            {'name': 'Home cinema', 'slug': 'home-cinema', 'icon': 'Film', 'order': 1},
            {'name': 'Enceintes Bluetooth', 'slug': 'enceintes-bluetooth', 'icon': 'Speaker', 'order': 2},
            {'name': 'Cameras & Surveillance', 'slug': 'cameras-surveillance', 'icon': 'Camera', 'order': 3},
        ],
    },
    {
        'name': 'Jeux video',
        'slug': 'jeux-video',
        'icon': 'Gamepad2', 'order': 5,
        'image_url': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=400&fit=crop&q=80',
        'children': [
            {'name': 'Consoles', 'slug': 'consoles', 'icon': 'Gamepad2', 'order': 1},
            {'name': 'Manettes & Accessoires', 'slug': 'manettes-accessoires', 'icon': 'Gamepad', 'order': 2},
        ],
    },
]

BRANDS = [
    'Samsung', 'Apple', 'Huawei', 'Xiaomi', 'Tecno',
    'Infinix', 'itel', 'LG', 'Hisense', 'Sony',
    'HP', 'Lenovo', 'Asus', 'Acer', 'Dell',
    'JBL', 'Philips', 'Bosch', 'Whirlpool', 'Haier', 'Midea',
]

FEATURED_BRANDS = ['Samsung', 'Apple', 'Xiaomi', 'Tecno', 'LG', 'HP', 'Haier', 'Hisense']

# Toutes les images sont verifiees sur nova.sn (pas de hotlink protection)
SAMPLE_PRODUCTS = [

    # ── SMARTPHONES ──────────────────────────────────────────────────────────
    {
        'name': 'Samsung Galaxy Z Flip 6 256Go',
        'slug': 'samsung-galaxy-z-flip-6-256go',
        'category_slug': 'smartphones',
        'brand': 'Samsung',
        'price': 625000,
        'old_price': 680000,
        'status': 'in_stock',
        'is_featured': True,
        'is_new': True,
        'image_url': 'https://nova.sn/34321-home_default/samsung-galaxy-z-flip-6-12-go-de-ram-memoire-256-go.jpg',
        'description': 'Samsung Galaxy Z Flip 6 pliable avec ecran Dynamic AMOLED 6.7 pouces, Snapdragon 8 Gen 3, 12 Go RAM et appareil photo 50 MP.',
        'specifications': {
            'Ecran': '6.7 pouces Dynamic AMOLED 2X 120Hz (pliable)',
            'Processeur': 'Snapdragon 8 Gen 3',
            'RAM': '12 Go', 'Stockage': '256 Go',
            'Appareil photo': '50 + 12 MP',
            'Batterie': '4000 mAh, charge 25W',
            'Systeme': 'Android 14 (One UI 6.1)',
            'Connectivite': '5G, WiFi 7, Bluetooth 5.3, NFC',
        },
    },
    {
        'name': 'Redmi A3x 64 Go',
        'slug': 'redmi-a3x-64go',
        'category_slug': 'smartphones',
        'brand': 'Xiaomi',
        'price': 39000,
        'old_price': None,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': True,
        'image_url': 'https://nova.sn/34000-home_default/redmi-a3x-memoire-64-go-ram-3-go-ecran-671.jpg',
        'description': 'Redmi A3x : smartphone economique avec ecran 6.71 pouces et batterie 5000 mAh longue duree.',
        'specifications': {
            'Ecran': '6.71 pouces HD+', 'Processeur': 'Helio G36',
            'RAM': '3 Go', 'Stockage': '64 Go',
            'Appareil photo': '8 MP', 'Batterie': '5000 mAh',
            'Systeme': 'Android 14 Go',
        },
    },
    {
        'name': 'Tecno POP 9 64 Go',
        'slug': 'tecno-pop-9-64go',
        'category_slug': 'smartphones',
        'brand': 'Tecno',
        'price': 50000,
        'old_price': 60000,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': True,
        'image_url': 'https://nova.sn/34118-home_default/tecno-pop-9-memoire-64-go-ram-3-go-ecran-667-pouces.jpg',
        'description': 'Tecno POP 9 avec ecran 6.67 pouces HD+ 90Hz, appareil photo IA et batterie 5000 mAh. Meilleur rapport qualite/prix.',
        'specifications': {
            'Ecran': '6.67 pouces HD+ 90Hz', 'Processeur': 'Helio A22',
            'RAM': '3 Go', 'Stockage': '64 Go',
            'Appareil photo': '8 MP IA', 'Batterie': '5000 mAh',
            'Systeme': 'Android 14 Go',
        },
    },
    {
        'name': 'Tecno Spark 30c 128 Go',
        'slug': 'tecno-spark-30c-128go',
        'category_slug': 'smartphones',
        'brand': 'Tecno',
        'price': 63000,
        'old_price': 75000,
        'status': 'in_stock',
        'is_featured': True,
        'is_new': True,
        'image_url': 'https://nova.sn/34424-home_default/tecno-pop-9-memoire-64-go-ram-3-go-ecran-667-pouces.jpg',
        'description': 'Tecno Spark 30c 128 Go avec ecran AMOLED 6.6 pouces 90Hz, Helio G85 et charge 18W.',
        'specifications': {
            'Ecran': '6.6 pouces AMOLED 90Hz', 'Processeur': 'Helio G85',
            'RAM': '4 Go', 'Stockage': '128 Go',
            'Appareil photo': '13 MP', 'Batterie': '5000 mAh, charge 18W',
            'Systeme': 'Android 14',
        },
    },

    # ── TELEVISEURS ───────────────────────────────────────────────────────────
    {
        'name': 'Samsung TV LED 55" 4K Smart',
        'slug': 'samsung-tv-led-55-4k-smart',
        'category_slug': 'televiseurs',
        'brand': 'Samsung',
        'price': 270000,
        'old_price': 320000,
        'status': 'in_stock',
        'is_featured': True,
        'is_new': False,
        'image_url': 'https://nova.sn/42102-home_default/samsung-tv-led-55u8072-55-smart-tv-4k-uhd.jpg',
        'description': 'Samsung TV LED 55 pouces 4K UHD Smart avec Crystal 4K, HDR10+ et Netflix/YouTube/Prime Video integres.',
        'specifications': {
            'Taille': '55 pouces', 'Resolution': '4K UHD (3840x2160)',
            'HDR': 'HDR10+', 'Smart TV': 'Tizen OS',
            'Connectique': 'HDMI x3, USB x2, WiFi, Bluetooth',
            'Garantie': '1 an',
        },
    },
    {
        'name': 'LG 70" Smart TV 4K UHD ThinQ AI',
        'slug': 'lg-70-smart-tv-4k-thinq-ai',
        'category_slug': 'televiseurs',
        'brand': 'LG',
        'price': 495000,
        'old_price': 560000,
        'status': 'in_stock',
        'is_featured': True,
        'is_new': False,
        'image_url': 'https://nova.sn/42223-home_default/lg-70-smart-tv-4k-up7550pvd-uhd-hdr-webos-thinq-ai.jpg',
        'description': 'LG Smart TV 70 pouces 4K UHD avec webOS 22, ThinQ AI, Magic Remote et Dolby Vision. Experience cinema chez vous.',
        'specifications': {
            'Taille': '70 pouces', 'Resolution': '4K UHD (3840x2160)',
            'HDR': 'Dolby Vision, HDR10, HLG', 'Smart TV': 'webOS 22',
            'IA': 'ThinQ AI + Google Assistant',
            'Connectique': 'HDMI x3, USB x2, WiFi, Bluetooth',
        },
    },
    {
        'name': 'LG NanoCell 75" Smart TV 4K',
        'slug': 'lg-nanocell-75-smart-tv-4k',
        'category_slug': 'televiseurs',
        'brand': 'LG',
        'price': 610000,
        'old_price': 699000,
        'status': 'in_stock',
        'is_featured': True,
        'is_new': False,
        'image_url': 'https://nova.sn/42233-home_default/lg-nanocell-75nano80-75-smart-tv-4k-hdr10-webos24-ai-magic-remote.jpg',
        'description': 'LG NanoCell 75 pouces 4K avec technologie NanoCell pour des couleurs pures, webOS 24 et Magic Remote.',
        'specifications': {
            'Taille': '75 pouces', 'Technologie': 'NanoCell',
            'Resolution': '4K UHD', 'Smart TV': 'webOS 24',
            'HDR': 'HDR10, HLG',
            'Connectique': 'HDMI x4, USB x3, WiFi, Bluetooth',
        },
    },
    {
        'name': 'Haier Mini-LED 65" 4K Google TV',
        'slug': 'haier-mini-led-65-4k-google-tv',
        'category_slug': 'televiseurs',
        'brand': 'Haier',
        'price': 435000,
        'old_price': 490000,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': True,
        'image_url': 'https://nova.sn/41600-home_default/televiseur-haier-mini-led-65-pouces-4k-google-tv-h65m80fux.jpg',
        'description': 'Haier Mini-LED 65 pouces 4K Google TV avec contraste exceptionnel et commande vocale integree.',
        'specifications': {
            'Taille': '65 pouces', 'Technologie': 'Mini-LED',
            'Resolution': '4K UHD', 'Smart TV': 'Google TV',
            'HDR': 'Dolby Vision, HDR10+',
            'Connectique': 'HDMI x4, USB x3, WiFi 6, Bluetooth 5.1',
            'Garantie': '2 ans',
        },
    },

    # ── CLIMATISEURS ──────────────────────────────────────────────────────────
    {
        'name': 'LG Split 12000 BTU Anti-Moustique Inverter',
        'slug': 'lg-split-12000-btu-anti-moustique-inverter',
        'category_slug': 'climatiseurs',
        'brand': 'LG',
        'price': 320000,
        'old_price': 365000,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': False,
        'image_url': 'https://nova.sn/35808-home_default/split-lg-12000btu-anti-moustique-refroidissement-puissant.jpg',
        'description': 'Climatiseur LG Split 12000 BTU avec technologie Anti-Moustique, Dual Inverter et WiFi ThinQ. Classe A++.',
        'specifications': {
            'Puissance': '12 000 BTU (1.5 CV)',
            'Technologie': 'Dual Inverter + Anti-Moustique',
            'WiFi': 'Oui (ThinQ)',
            'Classe energetique': 'A++',
            'Mode': 'Chaud/Froid',
            'Garantie compresseur': '10 ans',
        },
    },
    {
        'name': 'LG Split 18000 BTU Anti-Moustique Inverter',
        'slug': 'lg-split-18000-btu-anti-moustique-inverter',
        'category_slug': 'climatiseurs',
        'brand': 'LG',
        'price': 420000,
        'old_price': None,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': False,
        'image_url': 'https://nova.sn/35803-home_default/split-lg-18000btu-anti-moustique-inverter-puissant.jpg',
        'description': 'Climatiseur LG Split 18000 BTU/h 2 CV Anti-Moustique Inverter. Ideal pour grandes pieces 25-40 m2.',
        'specifications': {
            'Puissance': '18 000 BTU (2 CV)',
            'Technologie': 'Dual Inverter + Anti-Moustique',
            'WiFi': 'Oui (ThinQ)',
            'Classe energetique': 'A++',
            'Mode': 'Chaud/Froid',
            'Garantie compresseur': '10 ans',
        },
    },
    {
        'name': 'Midea Split 24000 BTU 3CV Inverter',
        'slug': 'midea-split-24000-btu-3cv-inverter',
        'category_slug': 'climatiseurs',
        'brand': 'Midea',
        'price': 350000,
        'old_price': 390000,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': False,
        'image_url': 'https://nova.sn/35701-home_default/split-midea-24000-btu-3-cv-gaz-410.jpg',
        'description': 'Climatiseur Midea Split 24000 BTU 3 CV Inverter Gaz R410. Solution economique et performante pour grandes surfaces.',
        'specifications': {
            'Puissance': '24 000 BTU (3 CV)',
            'Technologie': 'Inverter Gaz R410',
            'Classe energetique': 'A+',
            'Mode': 'Chaud/Froid',
            'Surface recommandee': '40-60 m2',
        },
    },

    # ── REFRIGERATEURS ────────────────────────────────────────────────────────
    {
        'name': 'Hisense Fontaine a Eau avec Frigo',
        'slug': 'hisense-fontaine-eau-avec-frigo',
        'category_slug': 'refrigerateurs',
        'brand': 'Hisense',
        'price': 95000,
        'old_price': 115000,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': True,
        'image_url': 'https://nova.sn/37171-home_default/fontaine-a-eau-hisense-avec-frigo-h85wdtp2s1dr.jpg',
        'description': 'Fontaine a eau Hisense avec refrigerateur integre (H85WDTP2S1DR). Eau fraiche et froide en permanence.',
        'specifications': {
            'Type': 'Fontaine avec frigo integre',
            'Capacite frigo': '5 litres',
            'Temperature': '5-15 degres C',
            'Couleur': 'Gris argent',
            'Garantie': '1 an',
        },
    },
    {
        'name': 'Hisense Fontaine a Eau Noire avec Frigo',
        'slug': 'hisense-fontaine-eau-noire-avec-frigo',
        'category_slug': 'refrigerateurs',
        'brand': 'Hisense',
        'price': 110000,
        'old_price': None,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': True,
        'image_url': 'https://nova.sn/41634-home_default/fontaine-a-eau-hisense-noir-h96wdtb3s1r-avec-refrigerateur-integre.jpg',
        'description': 'Fontaine a eau Hisense Noire (H96WDTB3S1R) avec refrigerateur integre. Design moderne adapte aux bureaux et maisons.',
        'specifications': {
            'Type': 'Fontaine avec frigo integre',
            'Capacite frigo': '10 litres',
            'Temperature': '5-15 degres C',
            'Couleur': 'Noir mat',
            'Garantie': '1 an',
        },
    },

    # ── INFORMATIQUE ──────────────────────────────────────────────────────────
    {
        'name': 'Lenovo IdeaPad Slim 3 Core i5 16Go',
        'slug': 'lenovo-ideapad-slim-3-core-i5-16go',
        'category_slug': 'ordinateurs-portables',
        'brand': 'Lenovo',
        'price': 380000,
        'old_price': 430000,
        'status': 'in_stock',
        'is_featured': True,
        'is_new': True,
        'image_url': 'https://nova.sn/41278-home_default/lenovo-ideapad-slim-3-pc-portable-14-core-i5-16-go-ram-512-go-ssd.jpg',
        'description': 'Lenovo IdeaPad Slim 3 14 pouces avec Intel Core i5, 16 Go RAM et SSD 512 Go. Ultra-fin et performant pour travail et etudes.',
        'specifications': {
            'Ecran': '14 pouces FHD IPS', 'Processeur': 'Intel Core i5 (12e gen)',
            'RAM': '16 Go DDR4', 'Stockage': 'SSD 512 Go NVMe',
            'Graphique': 'Intel Iris Xe', 'Systeme': 'Windows 11 Home',
            'Poids': '1.4 kg',
        },
    },
    {
        'name': 'Lenovo Yoga Tab Plus 12.7" 16Go',
        'slug': 'lenovo-yoga-tab-plus-127-16go',
        'category_slug': 'tablettes',
        'brand': 'Lenovo',
        'price': 450000,
        'old_price': 499000,
        'status': 'in_stock',
        'is_featured': True,
        'is_new': True,
        'image_url': 'https://nova.sn/41644-home_default/lenovo-yoga-tab-plus-127-3k-16-go-ram-256-go-clavier-et-stylet.jpg',
        'description': 'Lenovo Yoga Tab Plus 12.7 pouces ecran 3K, 16 Go RAM, 256 Go, avec clavier et stylet inclus. La tablette pro ultime.',
        'specifications': {
            'Ecran': '12.7 pouces 3K (2944x1840)', 'Processeur': 'Snapdragon 870',
            'RAM': '16 Go', 'Stockage': '256 Go',
            'Batterie': '10200 mAh', 'Systeme': 'Android 13',
            'Accessoires': 'Clavier + Stylet inclus',
        },
    },
    {
        'name': 'HP Moniteur 27" FHD IPS 75Hz',
        'slug': 'hp-moniteur-27-fhd-ips-75hz',
        'category_slug': 'accessoires-pc',
        'brand': 'HP',
        'price': 125000,
        'old_price': 145000,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': False,
        'image_url': 'https://nova.sn/42229-home_default/hp-p27-g5-moniteur-27-full-hd-ips-75hz-hdmi-displayport.jpg',
        'description': 'Moniteur HP P27 G5 27 pouces Full HD IPS 75Hz avec entrees HDMI et DisplayPort. Ideal pour le bureau.',
        'specifications': {
            'Taille': '27 pouces', 'Resolution': 'Full HD (1920x1080)',
            'Panneau': 'IPS', 'Taux de rafraichissement': '75Hz',
            'Temps de reponse': '5ms', 'Connectique': 'HDMI, DisplayPort, VGA',
        },
    },

    # ── HOME CINEMA & AUDIO ───────────────────────────────────────────────────
    {
        'name': 'LG Home Cinema 1250W Bluetooth',
        'slug': 'lg-home-cinema-1250w-bluetooth',
        'category_slug': 'home-cinema',
        'brand': 'LG',
        'price': 285000,
        'old_price': 320000,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': False,
        'image_url': 'https://nova.sn/37160-home_default/home-cinema-lg-1250-watt-lhd687bg-puissance-et-elegance.jpg',
        'description': 'Home Cinema LG 1250W (LHD687BG) systeme 5.1 avec Bluetooth, USB et lecture DVD. Son surround immersif.',
        'specifications': {
            'Puissance totale': '1250W RMS',
            'Canaux': '5.1 (5 enceintes + 1 caisson)',
            'Bluetooth': 'Oui',
            'Connectique': 'HDMI, USB, optique, coaxial',
            'Garantie': '1 an',
        },
    },
    {
        'name': 'LG Home Cinema 330W 5.1',
        'slug': 'lg-home-cinema-330w-51',
        'category_slug': 'home-cinema',
        'brand': 'LG',
        'price': 145000,
        'old_price': 175000,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': False,
        'image_url': 'https://nova.sn/37162-home_default/home-cinema-lg-330-watt-lhd457-son-surround-51-puissant-et-immersif.jpg',
        'description': 'Home Cinema LG LHD457 330W systeme 5.1 avec son surround immersif, USB et Bluetooth.',
        'specifications': {
            'Puissance': '330W RMS', 'Canaux': '5.1',
            'Bluetooth': 'Oui', 'USB': 'Oui (lecture MP3/WMA)',
            'Garantie': '1 an',
        },
    },

    # ── CAMERAS ───────────────────────────────────────────────────────────────
    {
        'name': 'EZVIZ C7 Dual Camera WiFi 2K+',
        'slug': 'ezviz-c7-dual-camera-wifi-2k',
        'category_slug': 'cameras-surveillance',
        'brand': 'Hisense',
        'price': 75000,
        'old_price': 90000,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': True,
        'image_url': 'https://nova.sn/42285-home_default/camera-wifi-ezviz-c7-dual-2k-double-objectif-motorisee.jpg',
        'description': 'Camera EZVIZ C7 Dual 2K+ avec double objectif motorise, detection IA et vision nocturne couleur.',
        'specifications': {
            'Resolution': '2K+ (4 MP)',
            'Objectifs': 'Dual motorise panoramique + tilt',
            'Vision nocturne': 'Couleur (10m)',
            'Detection IA': 'Personnes, vehicules',
            'Stockage': 'MicroSD 256 Go + Cloud',
            'Etancheite': 'IP67',
        },
    },
    {
        'name': 'EZVIZ EB5 Camera Solaire 4K',
        'slug': 'ezviz-eb5-camera-solaire-4k',
        'category_slug': 'cameras-surveillance',
        'brand': 'Hisense',
        'price': 90000,
        'old_price': None,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': True,
        'image_url': 'https://nova.sn/42263-home_default/camera-solaire-ezviz-eb5-4k-sans-fil-avec-detection-ia.jpg',
        'description': 'Camera solaire EZVIZ EB5 4K sans fil avec panneau solaire integre, detection IA et IP67.',
        'specifications': {
            'Resolution': '4K (8 MP)',
            'Alimentation': 'Panneau solaire + batterie 10400 mAh',
            'Detection IA': 'Personnes, animaux, vehicules',
            'Etancheite': 'IP67',
            'Stockage': 'MicroSD 256 Go + Cloud',
        },
    },

    # ── ONDULEURS ─────────────────────────────────────────────────────────────
    {
        'name': 'Onduleur Mercury Elite 1200VA Pro',
        'slug': 'onduleur-mercury-elite-1200va-pro',
        'category_slug': 'onduleurs-solaire',
        'brand': 'Haier',
        'price': 75000,
        'old_price': 89000,
        'status': 'in_stock',
        'is_featured': False,
        'is_new': False,
        'image_url': 'https://nova.sn/40508-home_default/onduleur-mercury-elite-1200-pro-1200va-720w-protection-complete-et-avr.jpg',
        'description': 'Onduleur Mercury Elite 1200VA/720W avec AVR (regulateur automatique), ecran LCD et protection complete contre les surtensions.',
        'specifications': {
            'Puissance': '1200 VA / 720W',
            'Regulation': 'AVR integre',
            'Affichage': 'Ecran LCD',
            'Prises protegees': '4 prises universelles',
            'Duree de bascule': '< 6ms',
            'Garantie': '1 an',
        },
    },
]


def download_image(url: str, filename: str):
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        if len(data) < 1000:
            return None
        return ContentFile(data, name=filename)
    except Exception:
        return None


class Command(BaseCommand):
    help = 'Cree des donnees de test pour le developpement'

    def handle(self, *args, **options):
        self.stdout.write('Creation des categories...')
        self._create_categories()
        self.stdout.write('Creation des marques...')
        self._create_brands()
        self.stdout.write('Creation des produits...')
        self._create_products()
        self.stdout.write(self.style.SUCCESS('\nTermine !'))

    def _create_categories(self):
        for cat_data in CATEGORIES:
            children = cat_data.pop('children', [])
            image_url = cat_data.pop('image_url', None)

            parent, created = Category.objects.get_or_create(
                slug=cat_data['slug'], defaults=cat_data)
            if created:
                self.stdout.write(f'  {parent.name}')

            if image_url and not parent.image:
                content = download_image(image_url, f'{parent.slug}.jpg')
                if content:
                    parent.image.save(f'{parent.slug}.jpg', content, save=True)
                    self.stdout.write(self.style.SUCCESS(f'    Image OK'))
                else:
                    self.stdout.write(self.style.WARNING(f'    Image ECHEC'))

            for child_data in children:
                child, created = Category.objects.get_or_create(
                    slug=child_data['slug'],
                    defaults={**child_data, 'parent': parent})
                if created:
                    self.stdout.write(f'    {child.name}')

            cat_data['children'] = children
            cat_data['image_url'] = image_url

    def _create_brands(self):
        for name in BRANDS:
            slug = slugify(name)
            Brand.objects.get_or_create(
                slug=slug,
                defaults={'name': name, 'is_featured': name in FEATURED_BRANDS})

    def _create_products(self):
        for p in SAMPLE_PRODUCTS:
            try:
                category = Category.objects.get(slug=p['category_slug'])
                brand = Brand.objects.get(name=p['brand'])
            except (Category.DoesNotExist, Brand.DoesNotExist) as e:
                self.stdout.write(self.style.WARNING(f'  Ignore : {p["name"]} ({e})'))
                continue

            product, created = Product.objects.get_or_create(
                slug=p['slug'],
                defaults={
                    'name': p['name'], 'category': category, 'brand': brand,
                    'price': p['price'], 'old_price': p.get('old_price'),
                    'status': p['status'], 'is_featured': p['is_featured'],
                    'is_new': p['is_new'], 'description': p['description'],
                    'specifications': p['specifications'],
                })
            if created:
                self.stdout.write(f'  {product.name}')

            if not product.images.exists() and p.get('image_url'):
                self._add_image(product, p['image_url'])

    def _add_image(self, product, image_url):
        content = download_image(image_url, f'{product.slug}.jpg')
        if content:
            img = ProductImage(product=product, is_primary=True, order=0, alt_text=product.name)
            img.image.save(f'{product.slug}.jpg', content, save=True)
            self.stdout.write(self.style.SUCCESS(f'    Image OK'))
        else:
            self.stdout.write(self.style.WARNING(f'    Image ECHEC : {product.name}'))
