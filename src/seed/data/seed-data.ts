
import * as bcrypt from 'bcrypt'
interface SeedProducto {
    title: string;
    description: string;
    price: number;
    images: string[];
    slug: string;
}

interface SeedUsuario {
    nombre: string;
    email: string;
    whatsapp: string;
    password: string;
    productos: SeedProducto[];
}

interface SeedUser {
    email:      string;
    fullName:   string;
    password:   string;
    roles:       string[];
    WhattsapNumber:     string;
}

interface SeedData {
    users: SeedUser[],
    usuarios: SeedUsuario[];
}

export const initialData: SeedData = {

    users: [
        {
            email: 'test1@gmail.com',
            fullName: 'David123',
            password: bcrypt.hashSync('David1234', 10),
            roles: ['admin'],
            WhattsapNumber: '1234567896'
        },
        {
            email: 'test2@gmail.com',
            fullName: 'Test',
            password: bcrypt.hashSync('David', 10),
            roles: ['user'],
            WhattsapNumber: '1234567896'
        }
    ],
    usuarios: [
        {
            nombre: 'Carlos Mendoza',
            email: 'carlos.mendoza@universidad.edu.co',
            whatsapp: '3001234567',
            password: 'Abc123456',
            productos: [
                {
                    title: 'Calculadora Casio fx-991',
                    description: 'Calculadora científica Casio fx-991, poco uso. Perfecta para cálculo, álgebra y estadística. No le falta ningún botón, funciona al 100%.',
                    price: 35000,
                    images: [
                        'calculadora-casio-frente.jpg',
                        'calculadora-casio-lado.jpg',
                    ],
                    slug: 'calculadora-casio-fx991',
                },
                {
                    title: 'Libro Cálculo Diferencial Stewart',
                    description: 'Libro Cálculo de James Stewart 7ma edición. Algunos subrayados en lápiz pero en buen estado. Incluye acceso a ejercicios online.',
                    price: 45000,
                    images: [
                        'libro-calculo-stewart-portada.jpg',
                        'libro-calculo-stewart-interior.jpg',
                    ],
                    slug: 'libro-calculo-diferencial-stewart',
                },
            ],
        },
        {
            nombre: 'María Fernanda López',
            email: 'maria.lopez@universidad.edu.co',
            whatsapp: '3109876543',
            password: 'Abc123456',
            productos: [
                {
                    title: 'Apuntes Circuitos Eléctricos I',
                    description: 'Apuntes completos de Circuitos Eléctricos I, incluye todos los temas del semestre: leyes de Kirchhoff, Thevenin, Norton y análisis de nodos. Escaneados en alta calidad, formato PDF.',
                    price: 8000,
                    images: [
                        'apuntes-circuitos-portada.jpg',
                        'apuntes-circuitos-contenido.jpg',
                    ],
                    slug: 'apuntes-circuitos-electricos-1',
                },
                {
                    title: 'Mochila Totto casi nueva',
                    description: 'Mochila Totto color negro, capacidad 30 litros. Usada solo un semestre, en excelente estado. Tiene compartimento para portátil de hasta 15 pulgadas.',
                    price: 60000,
                    images: [
                        'mochila-totto-frente.jpg',
                        'mochila-totto-interior.jpg',
                    ],
                    slug: 'mochila-totto-casi-nueva',
                },
            ],
        },
        {
            nombre: 'Andrés Ruiz',
            email: 'andres.ruiz@universidad.edu.co',
            whatsapp: '3157654321',
            password: 'Abc123456',
            productos: [
                {
                    title: 'Portátil Lenovo IdeaPad 15',
                    description: 'Portátil Lenovo IdeaPad 15 pulgadas, Core i5, 8GB RAM, 256GB SSD. Batería dura 4 horas. Incluye cargador original y maletín. Perfecto para programación y diseño.',
                    price: 1200000,
                    images: [
                        'lenovo-ideapad-frente.jpg',
                        'lenovo-ideapad-teclado.jpg',
                        'lenovo-ideapad-lateral.jpg',
                    ],
                    slug: 'portatil-lenovo-ideapad-15',
                },
                {
                    title: 'Almuerzos caseros domicilio',
                    description: 'Almuerzos caseros con sopa, seco, jugo y postre. Entrego en el bloque A, B y C de la universidad de lunes a viernes. Pedidos antes de las 10am. Precio especial para estudiantes.',
                    price: 8000,
                    images: [
                        'almuerzo-casero-1.jpg',
                        'almuerzo-casero-2.jpg',
                    ],
                    slug: 'almuerzos-caseros-domicilio',
                },
            ],
        },
        {
            nombre: 'Valentina Torres',
            email: 'valentina.torres@universidad.edu.co',
            whatsapp: '3204567890',
            password: 'Abc123456',
            productos: [
                {
                    title: 'Clases de inglés conversacional',
                    description: 'Ofrezco clases de inglés conversacional, nivel B2. Clases de una hora, presenciales en la biblioteca o virtuales. Ideal para preparar exámenes de suficiencia. Experiencia de 2 años enseñando.',
                    price: 25000,
                    images: [
                        'clases-ingles-1.jpg',
                    ],
                    slug: 'clases-ingles-conversacional',
                },
                {
                    title: 'Tablet Samsung Galaxy Tab A7',
                    description: 'Samsung Galaxy Tab A7 10.4 pulgadas, 32GB, WiFi. Con funda y vidrio templado. Ideal para tomar apuntes y leer PDFs. En perfecto estado, vendo por cambio de equipo.',
                    price: 450000,
                    images: [
                        'tablet-samsung-frente.jpg',
                        'tablet-samsung-funda.jpg',
                    ],
                    slug: 'tablet-samsung-galaxy-tab-a7',
                },
            ],
        },
    ],
};