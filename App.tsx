

import React, { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useNavigate, NavLink, useLocation } from 'react-router-dom';
import type { Recipe, Product, Donation, ScheduledRecipe, ShoppingListItem, ShoppingList, Ingredient, Note, User } from './types';
import { GoogleGenAI, Type } from "@google/genai";
import { AnimatePresence, motion, type Transition } from 'framer-motion';


// MOCK DATA
const mockRecipes: Recipe[] = [
  {
    "id": "1",
    "nome": "Bolo de cenoura com cobertura de brigadeiro",
    "categoria": "Pastelaria",
    "porcoes": 12,
    "ingredientes": [
      { "nome": "óleo de girassol ou milho", "quantidade": 120, "unidade": "ml" },
      { "nome": "cenouras médias, descascadas e picadas", "quantidade": 3, "unidade": "unidades" },
      { "nome": "ovos grandes", "quantidade": 4, "unidade": "unidades" },
      { "nome": "açúcar refinado", "quantidade": 400, "unidade": "g" },
      { "nome": "farinha de trigo peneirada", "quantidade": 300, "unidade": "g" },
      { "nome": "fermento em pó químico", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "leite condensado (para cobertura)", "quantidade": 1, "unidade": "lata" },
      { "nome": "chocolate em pó 50% cacau (para cobertura)", "quantidade": 4, "unidade": "colheres de sopa" },
      { "nome": "manteiga sem sal (para cobertura)", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "chocolate granulado para decorar", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Pré-aqueça o forno a 180°C e unte uma forma (redonda com furo no meio, de 24cm) com manteiga e farinha de trigo.",
      "No liquidificador, bata o óleo, as cenouras picadas e os ovos até obter uma mistura homogênea e lisa.",
      "Despeje a mistura do liquidificador em uma tigela grande. Adicione o açúcar e misture bem com um fouet.",
      "Incorpore a farinha de trigo peneirada e o fermento, misturando delicadamente apenas até a massa ficar homogênea. Não bata demais.",
      "Despeje a massa na forma preparada e leve ao forno por aproximadamente 40-45 minutos, ou até que, ao espetar um palito, ele saia limpo.",
      "Enquanto o bolo assa, prepare a cobertura: em uma panela, misture o leite condensado, o chocolate em pó e a manteiga. Leve ao fogo médio, mexendo sempre, até começar a ferver e engrossar levemente (ponto de brigadeiro mole).",
      "Retire o bolo do forno, espere amornar e desenforme. Despeje a cobertura quente sobre o bolo e finalize com chocolate granulado."
    ],
    "tempo": "50 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_3V3L6EQ-JffdBknoR3aou90ERLUzJUrdGw&s"
    ],
    "user_id": "tudogostoso_user",
    "views": 15876
  },
  {
    "id": "2",
    "nome": "Pudim de leite condensado simples",
    "categoria": "Pastelaria",
    "porcoes": 10,
    "ingredientes": [
      { "nome": "leite condensado", "quantidade": 1, "unidade": "lata" },
      { "nome": "leite integral (use a lata de leite condensado como medida)", "quantidade": 1, "unidade": "lata" },
      { "nome": "ovos inteiros", "quantidade": 3, "unidade": "unidades" },
      { "nome": "açúcar para a calda", "quantidade": 1, "unidade": "xícara" },
      { "nome": "água quente para a calda", "quantidade": 0.5, "unidade": "xícara" }
    ],
    "preparo": [
      "Primeiro, prepare a calda: em uma panela de fundo grosso, derreta o açúcar em fogo baixo até obter um caramelo dourado. Cuidado para não queimar.",
      "Adicione a água quente com muito cuidado (vai borbulhar) e mexa até que os torrões de açúcar se dissolvam por completo. Forre o fundo e as laterais de uma forma de pudim (com 20cm de diâmetro) com esta calda e reserve.",
      "Pré-aqueça o forno a 180°C.",
      "No liquidificador, bata o leite condensado, o leite e os ovos por cerca de 2 minutos, até a mistura ficar bem homogênea.",
      "Despeje a mistura do pudim na forma caramelizada.",
      "Cubra a forma com papel alumínio e asse em banho-maria (coloque a forma de pudim dentro de uma assadeira maior com água quente) no forno pré-aquecido por cerca de 1 hora e 30 minutos.",
      "O pudim estará firme quando, ao espetar, o palito sair limpo. Deixe esfriar completamente e leve à geladeira por no mínimo 4 horas antes de desenformar."
    ],
    "tempo": "60 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://static.itdg.com.br/images/640-440/3a4ad9def4cfa845063f443b85d2a463/245042-363669-original.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4092
  },
  {
    "id": "3",
    "nome": "Fricassê de frango cremoso",
    "categoria": "Culinária Geral",
    "porcoes": 6,
    "ingredientes": [
      { "nome": "peito de frango cozido e desfiado", "quantidade": 500, "unidade": "g" },
      { "nome": "creme de leite", "quantidade": 1, "unidade": "lata" },
      { "nome": "milho verde escorrido", "quantidade": 1, "unidade": "lata" },
      { "nome": "requeijão cremoso", "quantidade": 1, "unidade": "copo" },
      { "nome": "caldo do cozimento do frango (ou água)", "quantidade": 100, "unidade": "ml" },
      { "nome": "cebola picada", "quantidade": 1, "unidade": "unidade" },
      { "nome": "alho picado", "quantidade": 2, "unidade": "dentes" },
      { "nome": "azeitona sem caroço", "quantidade": 100, "unidade": "g" },
      { "nome": "queijo mussarela fatiado", "quantidade": 200, "unidade": "g" },
      { "nome": "batata palha", "quantidade": 150, "unidade": "g" },
      { "nome": "sal e pimenta do reino", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Pré-aqueça o forno a 200°C.",
      "No liquidificador, bata o milho, o requeijão, o creme de leite e o caldo de frango até formar um creme homogêneo. Reserve.",
      "Em uma panela, refogue a cebola e o alho em um fio de azeite até dourar. Adicione o frango desfiado e refogue por mais alguns minutos.",
      "Junte o creme do liquidificador ao frango, adicione as azeitonas, tempere com sal e pimenta do reino e cozinhe por cerca de 5 minutos, mexendo ocasionalmente.",
      "Transfira o refogado para um refratário, cubra com as fatias de queijo mussarela.",
      "Leve ao forno por cerca de 15-20 minutos, ou até o queijo derreter e borbulhar.",
      "Retire do forno, cubra com a batata palha e sirva imediatamente."
    ],
    "tempo": "40 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://static.itdg.com.br/images/640-440/45c5ed3ad3776e36bd6a531ff944803f/shutterstock-2253907173-1-.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4618
  },
  {
    "id": "4",
    "nome": "Brigadeiro tradicional",
    "categoria": "Pastelaria",
    "porcoes": 30,
    "ingredientes": [
      { "nome": "leite condensado", "quantidade": 1, "unidade": "lata" },
      { "nome": "manteiga sem sal", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "chocolate em pó (mínimo 32% cacau)", "quantidade": 4, "unidade": "colheres de sopa" },
      { "nome": "chocolate granulado de boa qualidade", "quantidade": 1, "unidade": "xícara" }
    ],
    "preparo": [
      "Em uma panela de fundo grosso, coloque o leite condensado, a manteiga e o chocolate em pó.",
      "Leve ao fogo médio-baixo, mexendo continuamente com uma espátula de silicone, raspando bem o fundo e as laterais para não queimar.",
      "Cozinhe por cerca de 8 a 10 minutos, até que a massa comece a desgrudar do fundo da panela ao incliná-la. Esse é o 'ponto de brigadeiro' para enrolar.",
      "Despeje a massa em um prato untado com manteiga e deixe esfriar completamente em temperatura ambiente.",
      "Com as mãos levemente untadas com manteiga, pegue pequenas porções da massa e enrole formando bolinhas.",
      "Passe as bolinhas no chocolate granulado e coloque-as em forminhas de papel."
    ],
    "tempo": "25 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://static.itdg.com.br/images/640-440/a373f494abb2c3360b9966f5abe130e2/brigadeiro-.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3254
  },
  {
    "id": "5",
    "nome": "Bolo de chocolate fofinho",
    "categoria": "Pastelaria",
    "porcoes": 10,
    "ingredientes": [
      { "nome": "ovos", "quantidade": 3, "unidade": "unidades" },
      { "nome": "chocolate em pó 50% cacau", "quantidade": 1, "unidade": "xícara" },
      { "nome": "manteiga sem sal, em temperatura ambiente", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "farinha de trigo", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "açúcar", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "fermento em pó", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "leite morno", "quantidade": 1, "unidade": "xícara" },
      { "nome": "uma pitada de sal", "quantidade": 1, "unidade": "unidade" }
    ],
    "preparo": [
      "Pré-aqueça o forno a 180°C. Unte e enfarinhe uma forma redonda de 25cm.",
      "Em uma tigela, peneire a farinha, o chocolate em pó, o fermento e o sal. Reserve.",
      "Na batedeira, bata os ovos com o açúcar até formar um creme claro e fofo.",
      "Adicione a manteiga e bata mais um pouco.",
      "Alternadamente, adicione a mistura de secos e o leite morno à batedeira, começando e terminando com os secos. Bata em velocidade baixa apenas para incorporar.",
      "Despeje a massa na forma preparada e asse por cerca de 40 minutos, ou até o palito sair limpo.",
      "Para uma calda simples, misture 1/2 xícara de leite, 3 colheres de sopa de chocolate em pó, 1 colher de sopa de manteiga e 2 colheres de açúcar. Leve ao fogo até engrossar e jogue sobre o bolo ainda quente."
    ],
    "tempo": "50 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://static.itdg.com.br/images/640-440/d30f2550068bdd64e089ff3e819938e5/100208-122765-original.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4132
  },
  {
    "id": "6",
    "nome": "Bolo gelado de coco (toalha felpuda)",
    "categoria": "Pastelaria",
    "porcoes": 15,
    "ingredientes": [
      { "nome": "ovos", "quantidade": 4, "unidade": "unidades" },
      { "nome": "açúcar", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "farinha de trigo", "quantidade": 3, "unidade": "xícaras" },
      { "nome": "leite fervendo", "quantidade": 1, "unidade": "xícara" },
      { "nome": "fermento em pó", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "leite de coco (para a calda)", "quantidade": 200, "unidade": "ml" },
      { "nome": "leite condensado (para a calda)", "quantidade": 1, "unidade": "lata" },
      { "nome": "coco ralado seco ou fresco para polvilhar", "quantidade": 100, "unidade": "g" }
    ],
    "preparo": [
      "Pré-aqueça o forno a 180°C. Unte e enfarinhe uma forma retangular (22x33 cm).",
      "Na batedeira, bata os ovos com o açúcar até obter um creme bem fofo e claro.",
      "Diminua a velocidade da batedeira e adicione a farinha de trigo aos poucos.",
      "Acrescente o leite fervendo e por último o fermento, misturando delicadamente.",
      "Despeje na forma e asse por aproximadamente 30-40 minutos, ou até dourar e o palito sair limpo.",
      "Enquanto o bolo assa, misture o leite de coco e o leite condensado para a calda.",
      "Assim que retirar o bolo do forno, ainda quente, fure-o por toda a superfície com um garfo.",
      "Regue o bolo com a calda, espalhando bem para que penetre em toda a massa.",
      "Polvilhe o coco ralado por cima e espere esfriar. Leve à geladeira por pelo menos 3 horas.",
      "Corte em quadrados e, se desejar, embrulhe individualmente em papel alumínio para servir."
    ],
    "tempo": "50 min + 3h geladeira",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://static.itdg.com.br/images/640-440/cf4237cb78202f2b0852ae7bb4ef980b/325143-original.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 5825
  },
  {
    "id": "7",
    "nome": "Torta salgada de liquidificador",
    "categoria": "Culinária Geral",
    "porcoes": 8,
    "ingredientes": [
      { "nome": "ovos", "quantidade": 2, "unidade": "unidades" },
      { "nome": "farinha de trigo", "quantidade": 12, "unidade": "colheres de sopa" },
      { "nome": "queijo parmesão ralado", "quantidade": 50, "unidade": "g" },
      { "nome": "leite", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "óleo", "quantidade": 0.5, "unidade": "xícara" },
      { "nome": "fermento em pó", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "sal", "quantidade": 1, "unidade": "colher de chá" },
      { "nome": "recheio a gosto (ex: frango desfiado, presunto e queijo, legumes)", "quantidade": 300, "unidade": "g" }
    ],
    "preparo": [
      "Pré-aqueça o forno a 180°C. Unte e enfarinhe um refratário médio.",
      "No liquidificador, bata os ovos, o leite, o óleo, o sal e o queijo ralado.",
      "Adicione a farinha de trigo aos poucos, batendo até obter uma massa homogênea.",
      "Por último, adicione o fermento e pulse apenas para misturar.",
      "Despeje metade da massa no refratário.",
      "Espalhe o recheio de sua preferência (previamente preparado e frio) sobre a massa.",
      "Cubra com o restante da massa.",
      "Opcional: polvilhe mais queijo ralado por cima.",
      "Leve ao forno por cerca de 30-40 minutos, ou até que a superfície esteja dourada e firme."
    ],
    "tempo": "40 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://static.itdg.com.br/images/640-440/14757a744f601807de8e70b2b6e731f1/51917-original.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 2800
  },
  {
    "id": "8",
    "nome": "Panqueca de carne moída",
    "categoria": "Culinária Geral",
    "porcoes": 10,
    "ingredientes": [
      { "nome": "farinha de trigo (massa)", "quantidade": 1.5, "unidade": "xícaras" },
      { "nome": "leite (massa)", "quantidade": 1.5, "unidade": "xícaras" },
      { "nome": "ovos (massa)", "quantidade": 2, "unidade": "unidades" },
      { "nome": "óleo (massa)", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "sal (massa)", "quantidade": 1, "unidade": "pitada" },
      { "nome": "carne moída (recheio)", "quantidade": 400, "unidade": "g" },
      { "nome": "cebola picada (recheio)", "quantidade": 1, "unidade": "unidade" },
      { "nome": "alho picado (recheio)", "quantidade": 2, "unidade": "dentes" },
      { "nome": "molho de tomate (recheio)", "quantidade": 1, "unidade": "xícara" },
      { "nome": "sal, pimenta e cheiro-verde (recheio)", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Para a massa: bata todos os ingredientes (farinha, leite, ovos, óleo, sal) no liquidificador até ficar homogêneo. Deixe descansar por 10 minutos.",
      "Para o recheio: refogue a cebola e o alho em azeite, junte a carne moída e cozinhe até ficar soltinha. Adicione o molho de tomate, sal, pimenta e cheiro-verde. Cozinhe por mais 5 minutos e reserve.",
      "Aqueça uma frigideira antiaderente untada com um fio de óleo. Despeje uma concha pequena de massa e gire a frigideira para espalhar.",
      "Cozinhe até a borda soltar, vire e doure do outro lado. Repita até acabar a massa.",
      "Recheie cada disco de panqueca com a carne moída e enrole.",
      "Disponha as panquecas em um refratário, cubra com mais molho de tomate e queijo parmesão ralado.",
      "Leve ao forno pré-aquecido a 200°C por 15 minutos para gratinar."
    ],
    "tempo": "60 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://static.itdg.com.br/images/640-440/36343707974176d0cc62e165b04dbca7/12142-87424-original.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3755
  },
  {
    "id": "9",
    "nome": "Bolinho de chuva sequinho",
    "categoria": "Pastelaria",
    "porcoes": 25,
    "ingredientes": [
      { "nome": "ovos", "quantidade": 2, "unidade": "unidades" },
      { "nome": "açúcar", "quantidade": 1, "unidade": "xícara" },
      { "nome": "leite", "quantidade": 1, "unidade": "xícara" },
      { "nome": "farinha de trigo", "quantidade": 2.5, "unidade": "xícaras" },
      { "nome": "fermento em pó", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "essência de baunilha (opcional)", "quantidade": 1, "unidade": "colher de chá" },
      { "nome": "óleo para fritar", "quantidade": 1, "unidade": "suficiente" },
      { "nome": "açúcar e canela para polvilhar", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Em uma tigela, misture os ovos e o açúcar. Adicione o leite e a baunilha e mexa bem.",
      "Acrescente a farinha de trigo e o fermento peneirados, misturando até formar uma massa homogênea e um pouco grudenta.",
      "Aqueça o óleo em uma panela funda em fogo médio. O óleo não deve estar muito quente, para que o bolinho cozinhe por dentro sem queimar por fora.",
      "Com o auxílio de duas colheres, modele pequenas porções da massa e coloque para fritar no óleo quente.",
      "Frite os bolinhos até que estejam dourados por igual, virando-os na metade do tempo.",
      "Retire com uma escumadeira e coloque sobre papel toalha para escorrer o excesso de óleo.",
      "Passe os bolinhos ainda quentes na mistura de açúcar e canela."
    ],
    "tempo": "25 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://static.itdg.com.br/images/640-440/7a7a61d281134f5e67c10f3f43d309ee/32684-312701-original.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3744
  },
  {
    "id": "10",
    "nome": "Bolo simples e fofo para o café",
    "categoria": "Pastelaria",
    "porcoes": 12,
    "ingredientes": [
      { "nome": "açúcar", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "farinha de trigo", "quantidade": 3, "unidade": "xícaras" },
      { "nome": "margarina ou manteiga em temperatura ambiente", "quantidade": 4, "unidade": "colheres de sopa" },
      { "nome": "ovos", "quantidade": 3, "unidade": "unidades" },
      { "nome": "leite", "quantidade": 1.5, "unidade": "xícaras" },
      { "nome": "fermento em pó", "quantidade": 1, "unidade": "colher de sopa" }
    ],
    "preparo": [
      "Pré-aqueça o forno a 180°C. Unte e enfarinhe uma forma com furo central.",
      "Na batedeira, bata a margarina, o açúcar e as gemas até formar um creme esbranquiçado.",
      "Adicione a farinha de trigo e o leite, alternadamente, batendo em velocidade baixa até a massa ficar homogênea.",
      "Em outra tigela, bata as claras em neve.",
      "Incorpore delicadamente as claras em neve e o fermento à massa, com movimentos de baixo para cima.",
      "Despeje na forma preparada e asse por aproximadamente 40 minutos, ou até o palito sair limpo."
    ],
    "tempo": "50 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://static.itdg.com.br/images/640-440/cfaeadb92ac4a77e9b0ebaf46816c7e2/68843-320646-original.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3516
  },
  {
    "id": "11",
    "nome": "Torta de frango de liquidificador fácil",
    "categoria": "Culinária Geral",
    "porcoes": 15,
    "ingredientes": [
      { "nome": "peito de frango cozido e desfiado", "quantidade": 500, "unidade": "g" },
      { "nome": "cebola picada", "quantidade": 1, "unidade": "unidade" },
      { "nome": "tomate picado", "quantidade": 1, "unidade": "unidade" },
      { "nome": "ervilhas ou milho", "quantidade": 1, "unidade": "lata" },
      { "nome": "cheiro-verde picado", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "leite (massa)", "quantidade": 500, "unidade": "ml" },
      { "nome": "óleo (massa)", "quantidade": 240, "unidade": "ml" },
      { "nome": "ovos (massa)", "quantidade": 3, "unidade": "unidades" },
      { "nome": "farinha de trigo (massa)", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "queijo ralado (massa)", "quantidade": 50, "unidade": "g" },
      { "nome": "fermento em pó (massa)", "quantidade": 1, "unidade": "colher de sopa" }
    ],
    "preparo": [
      "Prepare o recheio: refogue a cebola e o alho, junte o frango desfiado, o tomate, a ervilha e o cheiro-verde. Tempere com sal e pimenta e reserve.",
      "Pré-aqueça o forno a 180°C. Unte um refratário grande.",
      "Para a massa: no liquidificador, bata o leite, o óleo e os ovos.",
      "Adicione a farinha e o queijo ralado e bata até homogeneizar. Por último, adicione o fermento e pulse rapidamente.",
      "Despeje metade da massa na forma, espalhe o recheio de frango e cubra com o restante da massa.",
      "Asse por cerca de 40 a 50 minutos, até dourar."
    ],
    "tempo": "70 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://static.itdg.com.br/images/640-440/9fdb7c8f39a0159c559e36e665673301/317634-original.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3533
  },
  {
    "id": "12",
    "nome": "Rosca Doce Fofinha (Pão de Leite)",
    "categoria": "Pastelaria",
    "porcoes": 1,
    "ingredientes": [
      { "nome": "farinha de trigo", "quantidade": 500, "unidade": "g" },
      { "nome": "açúcar", "quantidade": 0.5, "unidade": "xícara" },
      { "nome": "fermento biológico seco", "quantidade": 10, "unidade": "g" },
      { "nome": "leite morno", "quantidade": 250, "unidade": "ml" },
      { "nome": "manteiga derretida", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "ovos", "quantidade": 2, "unidade": "unidades" },
      { "nome": "sal", "quantidade": 1, "unidade": "colher de chá" },
      { "nome": "gema para pincelar", "quantidade": 1, "unidade": "unidade" }
    ],
    "preparo": [
      "Em uma tigela, misture o fermento com o leite morno e uma colher de açúcar. Deixe descansar por 10 minutos para ativar.",
      "Em outra tigela grande, misture a farinha, o restante do açúcar e o sal. Faça um buraco no meio.",
      "No buraco, adicione os ovos, a manteiga derretida e a mistura de fermento ativada.",
      "Misture tudo e sove a massa por cerca de 10 minutos em uma superfície enfarinhada, até ficar lisa e elástica.",
      "Coloque a massa em uma tigela untada, cubra e deixe crescer em um lugar morno por 1 hora, ou até dobrar de volume.",
      "Modele a rosca ou os pãezinhos, coloque em uma forma untada e deixe crescer por mais 30 minutos.",
      "Pincele com a gema batida e asse em forno pré-aquecido a 180°C por 30-35 minutos, até dourar."
    ],
    "tempo": "2h 30min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://anamariabrogui.com.br/assets/uploads/receitas/fotos/b96157f74a8810f6bc286644f9242ffd88a9208d.png"
    ],
    "user_id": "tudogostoso_user",
    "views": 4400
  },
  {
    "id": "13",
    "nome": "Mousse de Chocolate Aerada",
    "categoria": "Pastelaria",
    "porcoes": 6,
    "ingredientes": [
      { "nome": "chocolate meio amargo (50-70% cacau)", "quantidade": 200, "unidade": "g" },
      { "nome": "creme de leite fresco (ou nata)", "quantidade": 200, "unidade": "ml" },
      { "nome": "claras de ovo", "quantidade": 3, "unidade": "unidades" },
      { "nome": "açúcar", "quantidade": 3, "unidade": "colheres de sopa" }
    ],
    "preparo": [
      "Pique o chocolate e derreta em banho-maria ou no micro-ondas (em potência média, de 30 em 30 segundos). Deixe esfriar um pouco.",
      "Bata o creme de leite fresco bem gelado em ponto de chantilly mole. Reserve na geladeira.",
      "Bata as claras em neve. Quando começarem a espumar, adicione o açúcar aos poucos e continue batendo até formar picos firmes e brilhantes.",
      "Incorpore 1/3 das claras em neve ao chocolate derretido para amolecê-lo. Depois, adicione o restante das claras e o chantilly, misturando delicadamente com uma espátula, de baixo para cima, para não perder o ar.",
      "Distribua a mousse em taças individuais e leve à geladeira por no mínimo 4 horas antes de servir."
    ],
    "tempo": "30 min + 4h geladeira",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://cdn.oceanserver.com.br/lojas/lightandjoy/uploads_produto/moussedeusa-5f56dc0da25b0.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4600
  },
  {
    "id": "14",
    "nome": "Arroz Doce Cremoso",
    "categoria": "Pastelaria",
    "porcoes": 8,
    "ingredientes": [
      { "nome": "arroz agulhinha", "quantidade": 1, "unidade": "xícara" },
      { "nome": "água", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "leite integral", "quantidade": 1, "unidade": "litro" },
      { "nome": "açúcar", "quantidade": 1, "unidade": "xícara" },
      { "nome": "leite condensado", "quantidade": 0.5, "unidade": "lata" },
      { "nome": "canela em pau", "quantidade": 2, "unidade": "unidades" },
      { "nome": "cravos-da-índia", "quantidade": 4, "unidade": "unidades" },
      { "nome": "canela em pó para polvilhar", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Lave o arroz em água corrente e escorra bem.",
      "Em uma panela, cozinhe o arroz com a água, a canela em pau e os cravos, em fogo baixo, até a água secar.",
      "Adicione o leite e o açúcar, e continue cozinhando em fogo baixo, mexendo de vez em quando para não grudar, por cerca de 20 minutos ou até o arroz ficar bem macio e o caldo cremoso.",
      "Desligue o fogo, adicione o leite condensado e misture bem.",
      "Sirva morno ou frio, polvilhado com canela em pó."
    ],
    "tempo": "45 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExIVFhUWFxgVFxcYFxUWFRgXFRUWGBcWFxgYHSggGB0lHRUXITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGi0lHR0tLS0tLS0tLS0tLSstLS0tLS0tLS0tLSstLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSstLf/AABEIAKgBKwMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAACAwEEBQAGB//EAD0QAAEDAgMFBgQEBgEEAwAAAAEAAhEDIQQxQRJRYXGBBSKRocHwEzKx0RRCUuFicoKSsvEGI1OiwgcVM//EABoBAQEBAQEBAQAAAAAAAAAAAAEAAgMEBgX/xAAiEQEBAAICAwEAAgMAAAAAAAAAAQIRITEDEkFRYaEEcZH/2gAMAwEAAhEDEQA/APfVHhokmBxsiow6YcLZxoeM8/PMKBRD9prsvl1GYm0e7ZHSjiMEGuvtPkF20XNBhozm8nITYXEEXC7Pd4fFh689tB0AxtCdxIB8M9d08NVAuqmH7PovEtLrbwBGRES3KCL/AEzVotDCGjLZHlb6R9yijz+LHW53BlqiAk1HE5IWUzqs7eJYleO7cwffqs/V3m/1X/ykdF7JhCz/APk/Zzmtp1SIklka6ubO7J3isZ9NY9vG4E7TAY9+5R9nVxRxDXH5QQ48gYcOrXEKKLdl727yHjkZnzlDj6R7pH6gP7req4yt19Kr9sx3abQBvFvPM+Sy62Jc7NxPvzWVg8ePhtmS4DZP9NpJ4gA9VzsY45CPNOVrEkXtpKfiQNfBUy5xzlRsrG2lg4zcF34x2keCS2kmCjCPZAdXcdSlk80/4YXfDCPalWclh53lWzSCA0Ai5ZJXNV36j4o2Ypwzgozhwu/DrHtkTBixqCEf4pu9VjRKW4EaJ9i0WVAcjKNjiLgwsoEck1tdw481TKJ6LCds1GWJ2huPv7LWw2Lo1bRsO4fZeLpYuLEW4K/ScCJC7Y+Sxi4yvTYjBObfMbx6qsl9n9sPZZ3ebx+Yddeq1QKNYS07J108Qu+OcrFxsZyghOxGHczMdRkkSujLlygripOJSaj1O2uLJUUB67YRgBdKkVt7Jk/KRB4RkTw3zIEDmF4suLpawOLYiW3cDBJD7xkAMySM3WTi5VxTP5SWjcDa+dsr671berxeeYzWR+EqnZJcz4Yz3Dju+WwJy/kyQjvHa0yHLfGhJP0m8qG4fVxJOdyTllbJPVaz5fNMuMXAI6dMuMASSpo0S4wBJ93VrEYhtBuy27zmftuCzbp5xH4dASYc/wCnADf7svP9s4l1ZrpOkgfy39PNdXqlxklUK2M0b4/ZcMsttyaYuIpd5juh5H/Q8V2KIAA1Jt0Mz4iPHcqdajsuc0W2TaDEDNvkQuDyTJMlOOPJt4aXZx7xbMSA7qLH08CtFrQFkMDpBaCSN14FpjzHUq3VxNQEAUZJiJJAvwj1TnhbdxmVbUFRTGJgdyiJzbBc4ctp0jxKsYTB4gul1V7BqGkMnwyXP0O1dr+KZ8TirGM7Nqn5MRVbuBdtN81RdgMVP/6Uzwcxh84keKvSLZ8qNpDhKNUmKlIMjVrzHCA6Z8QmNptJgEg7nCD9j0KrjpFOeg2uKsVMGUh2DKxdNaQH8VIelHDOCEtIRwllpRFVNsomV96Lj+HZrmBKNHcjD+KMFZuB2rxvCZRqlpsemidsgpbqKJwllnaH6m+Cs0sUCZa646FZvwDoehSy0hdJknrMD22R3aglp8P2+nJXa+DBG3TMt1GoXi6WKIsbjzWv2X2mad2mRu9I98F2x8mu3PLH8aKhxV8tbXbt07O1bv4hZlUEL0SsF023TnKWBSlFwphEVygENUwuBUoLgjpsJIAEkoFfMUWbR+ci28A6cz7yRbpIxWIFFmy27zmeO7kF5+vWzc49UWIrTLiVk16xeeGgXDLLbcmk4iuXWFh9VApRCKmI5qXFYvJY/aUfFO8taf8AIf8AqksGlrdM/qr1HBmq41MmkgNPBo3a5k8JW7geyaTQCRJnIjcBeV14k5Cp2FQIaSbbURvgancFuNpE3LRGotccAjZhmmYnJMNOMli5VaAxgAiMvfiicRvMe7p7zMZc4gniVLZAABsDPXeixFOw8GL+HCY4HgpNGZm/lYQAmg8p8VAdvjz96K4RDsMCIgWk2mdN6TWwYIhzAY1yJG4+9VeIE69N3VEWjjHKZ5nTpOSomR+Eeyze+3cbEcB7CayjImCNCCIIO4rQ+HnfyShTIM9OBHJNko3YpnChKfggVeDwSRl4HwIz3el0S5WablYtXs8KlW7PXpy0IfgArOq1t5GphiELJC9VicG3S6za+BT7WdrTNbUTw+Vz8MQlOpkZeCeKOj2lLrtXU3yj2Vi8FUc1Cx5abWVt7JCrObofFUy0tNTs7tAtO02xGY9RvXpXBuIZtsjbHzN3rwrQQbZrX7L7QLXBwsRmP23Lvhnr/TGWO2s1SVdxTBUb8Vn9Q47/AHwKoEL1SubiUk4gLqlIkrvw4SjCulTKKlTLiAMyYQlvs2kLvcLNy4uWX2hi/iOJm2n396ALT7ZrhjRSbug+p65eK8rj8R+UdfsuGeW+GsZ9KxVfaMDIZceKmmzZHFDQZqeikhc9tOCCpQdUIptnvZ8t3X6c09jN+WZO4DNbPZeH+Ez4hs94kfwtynwsOF10wmuRSRg9ju5Ra14jkrNNhIkjgCmqX04kSDyyXO97al4C0wQmgz5eKENtdEALWA1m86qmwIukImmUsRCkjjZW0kAjxRNaNRbhA+oQugiJRBonOeEfuqJDwL7NhxueqHavf37zROASnM1zWctzo8G/HzvHVc6bFAGZTHgJ8skdo3J3b2NQt4GcX38fcoWukJzGzYDQ+Qn0SdiDOmvMa+H0CbNwTgQTKbwMxI80oFSsNHVdmbFV3MCJcqlWqYdU6uEWqhcyUaO3nK+FIyQMJBgrfqUFRxODDrizt2h5JCmocybEJZJBgpwKzYVSpTIUU3wZGnuFacFWrU4uEY3Seh7D7R2HD9LtPT3x3rT7QohhDm/I64+y8lgn5jfcL1PZGJFVhovN/wAp45g++O9enxZ/HPKfVY1V22oq0iCQcxY9Fy9DCNpaPZojaqH8ogfzH9vqsltW60O0quxRazUiTzd+0jwWbdQ6ZGNxUlzzfdyyA97yshtPadnxPHX7p2PrCQ3dc89B73oaAgTv04Ly2/22J53cl1JhNguDVt9k4QfM7S8b+ATIg0cE1rW7f5rgau2SDHXLlKeSXEk6n374JfaFb/qMnc7zLB75pzL68s1vc1oOAuiAUQCiaFgpAshIuiDpUkK0nMAi+flzPFcw3k6Hoea5olrpmbRuvMqK5v3RAtbpdSGR7C5zSMwQeIhC02v7+yNotmpJcbIY1Exr6SjCjaHiPX9k2ABcF1JoJEm03U7O4zz9mE7ChkHbsTaIJ6jiiTnk0oUyHwOh0I3yNOKGvTEnZJ4TEpzHlvyuPveJKr4l1yQLZ8Z9yniAdGs3YDS2Te+tyipPZFwZ4KnRNp4n6prom2Sza1IlE2NUCkFBS4LkJK5SHCTVpJrUSEycbhdq/wCYef7rLaYMFelqsWdj8JtAuAuLn7hPaUEshcx2iIhYuJVxLTI5j7LUwteCHj3/AK9FQe20I8C/NvUeqcb/AEnp+1TtNbWb+azuDh7+izPilaPYj9tjqR1FuYuPf8KTsDcvbjdxx6ZeFY59RjdC4A8pv5Sr3bmIBqHc2ft9Ai7GIDi79LXO8BHqsntOrZ532+jfosZ3hv6ymuLnTeSZK0GiVUwjcyrTLrz90ruAw5e6wW3SoBggXj82/lwSuzKGyydTYHh+Y/QdUyu/QLd4CliHAuEtykCciO6T9An03cFTxhkA/pcD0ILT/lPRWmb5RLuLQmu1zTRf3zQU7GdPqrL2bDpEG2sGzgqSokNuDffukbkVrwMz4BRCMXG1IvpqOYiyUGFMKCETBmZFvEngpFOdvCXTrXg71Ysudhmlu0DcGCI8ws2XuHcCype270v6hMc2CYAIvkdoeZKUxsGUTJgRvjqcoVKNGfD/AIrcQ70BHmoI4/ukmte6ZmJm+5O4tD+GDqR0kHzsk1KgGallXP371VfFOETw+6dz4HUXyJ3yfMo1H4Oo07OzZoz0iN6hjkXFSmALkVMib5axmn1qAzDpGiNNbVly6FyKRAq4Ph7H8SpBHpOipRY6Etwi/uE0BQQosDtTCbB2m/KbhVmOkL0NajtNc3+ocxn74LzhbskhKMIlJB2XA+PXNWAUquyxWJ2WtgaxY8Ee4v6R1Wzi8G4vJaJabjrf1Xm6LpaDrHmP3Xruzse34bZzjy08oXo8WWo55/rHoWa/Q7Mf3f6Xm+0XyBxdP1+63qzo2/5Wf5lefxhnZ5HxsnyfFHUBDfNXMDSlwSWCwC1OxWgO2jpJ/tErljODWo52yQz9IjrmfO3RUq9WTyROMySb58yqc3WcqZFhwBbJyNhxOvSIUYerYefMKrUeYGu5Qyrs5i/TcLKlOmk2v4+/fVWiQdm+l/E28Fm0iXNBkGwvmFaY3whalosWYXEIDUIN5XfEsrcHJz2QJkEk5ai2u5BK5jweih7bqt+oxryJgxyKho3k88ykhxmT904vJvnz8UzKVaA4X1z4Tmpc4ECwAy5njxXNdrAtMz4e+aipGbQc/lmfBCDsAqDSk7LRI0Op5qGgmFLqkENiCI8RzVwgNlpkgHdNweaXG0YAkkieQuTCdVtr7+3Hkh7MaWP23NkbMC4uSRB8B5ok1wryHtCpVawQHuabAAT47hzRYbBPawOeOJ68FrOxRLXSDTcBIyuqlCu5x2TLgcwbHxXS34zFUlQU/FU2CNkOkZgoK0TIi+m7guemiyuBR0mgnvGBvUvogfmBPCVaIn0iInW4R0Hwc4BsdUraNhNhkuV0l2s0tsSC2LRHRVFNN0cVNWJkCxVVCw6CDuWZ27hADIyPeHIrTQ4ultU8sj5H9wmJ52ndFVMBQGwSEx4tfrxELFhdg8iNxPnf1WhQrNDQDnfwm3ks/DWJndPh/tTVBkreOXqrNr2KNn8Wt/8AF5J+qw8RmOR9FtY5plsate3OLw0j/ErHcJcBz9+S7eRzhsQtPsxvdJOjZHUj7rOe1amDAFM7yR4X+wXL4UuVau+ye9Ua77kD3xXOtkvdxKHaS3omKkO13C4iBGkyrgxEm2SzgFDCQZH7LVEbdOpN8ymE6rJp46MxHs6rQL5bM2RFTQ2cjpllrFk2d/j/AKVA1tB75qPjFtybEW+yzMptWLwrt3ixRMcDp4Z8PfFUcOKZvB2ukeCs0XQnHK2qyQ14jnqq9OoTc++iYHXAK6oAYAF5utX9jMd+In37gIcQ7ZEkidd4+yXWeG+u7n73JBxMmZtpv6eavbjla/F7Ddl1Kga4nZEgxFyPS3vVaGKwViRYAfTMQswYhx/M4jcSVbwmKDTJBK1PUcuwuGLzJnZ32OWl06vRfaXG2R16lHU7TaPlbn0Qfjw4QQRyK1wOXVKFM94udOsXM8VQeUdansuIvG+COk6phbSPeBcP4f33LN5aV0QGV+f7Jle1pa4GDIEQlrJcQphHRiQTETcKarhtS0QAbcwpOdTIQOV6nim7N5nI7iqFZ4la0NolOpCWuE6ZJAKdhnd4eCJ2XnsU2Hrm59VZ7Wpw7rCS0BFihNFp2oMZQdyskJDfn97lZhWjDO0SAKZP/caP7g5t+He+iwscSx/L7QfoVd7Z7fw1Njg+q2dkkAd4yBINt0T0Q9pUwdlw1E+98naXpy6Y1foKVQOE+/dlsUI2OMjwgrJoUgG2WphW9yZ3c+nBcJ0kVFSrslXHqtVyhZ00pOzuuaFLhdRKksMUOCik5SLlKcApc4xE2UqEJdwNQbJ3iR73aFIxOIMRrlmkU6myZCXPJFMaWBcNgmBOUlD+MIBAk3mNJWeXWUAzks3+C2sPigYmJTa2KDRw3DMrEYIRB11rG1mw6tULjnHCyimDN0CbRCi0cM8jIqxsbr9ErBVQ03ErYa1wBs3U92Z6LU5ZrMpgD5myDbceYKuYOlSnMzudHoup4Vxudd5PgubgpN5Gd+Rj1WpP4G1jHObZrpAORsUFbBNLBsdCNUH/ANebgnu6H8w6Idl9PImPLw0Kb/MBfwtqn8p2mW4np1VcMj3dW3133l0DgRB6DJBSw+0e6QesLNjWyXRoZHKERM7pT6uCI/MFXqM2fuN6LwkOEIKl9EbnzqghUpCAm0jdA4Kxg6YO1IvEj31TOQzu1W7RNtVnERM5q52hUIjcqwFvqi0lUMxzP0KsjBl1wT/qyr0WkxznoNFs4emdkQDv8breGOxa+K4mmAJpYdpc3aMV9urUswPL9mA0SABkZgaXXuf+Ldo/icFTJ+anLHQQYIgD5bXGzkB8xXhq3a/dqQQ6lFw1uwAXO2JINg4tBIi+RIAkLS/+O8cGVTSJIp1y5rSYnapBu43c4bRmYOyIyTh5Pa6r9b/O8O8d66e4wuRC0cGe6R7sVm/K/r76fstDDOgxvRJ3H45jgq1UK65qQ5pBkaLm0zaoKFOcxLcooplPEqvKc2oopdZCVwk3URCNkLwEIEKS1cG6oKHGFwcd1kTgpaEIbUQCgIgkJVjDhV4VrChMC/hZ2hGcz4LVp4tpBBJFuXhCpYfDBzoBiBMe81aoECzrzqOO8rpNsVZoVmxYiBxyHGUHxwMnE+B+iXi8KwCYiL2yKqueZsbQDYXnSOKfawaXziQRIvoYzugrVtphLZImCIjnCdSoAOJi5z56lE5wmJE7vXitcplfCJGTulxxg70NItuC0niLEdFfNbYcRHdnMCIPqpq/O1wzNjxFvusaO1KriHFuy7Q5n5kglaGPoiJAWfHl6LN3KZ05x+y5QiCilW+zx3unv6qoFaw1TZDtCRY8k49isztMX/qVSLHkrOMuQqtYiClAwzJMdOPH6L2WEbssaDEx9b+q852Phi57QRbM/UjoLf1Bec7bxtWrXqPp4kMYXQ1sA2b3Zy12Z6rt48dxjJ8yHb1CmT8DCU4mf+s59YmN7ZDAYJvsnwVbG/8AK8S5rGlzWtY8VWBjWUwIJgEU4EA6EaA8+XLyS19J5ccfz/vL6xgMc3E4enXbF2jaAAsRYtMZmbTyVunU7oPDwt6Lly9WU49nz3knrncY1KZmmDuMHrceqhpImNx8NSuXLlexGY5qU4eK5cubYHKKdQFcuVScHbyohSuWSEqAuXKSHFFSMrlyto2EYULkoTQr+GYS4Wn5RGWUALlyZ2zXoaNOHSN0G8jPQ8DNuKLaJJBb3RqYIPRcuXocgig0ZSBumQfFN2WzOyJ5BQuUkkqpisKXuDg+IGWmt+C5cq8oOMfMCRAN4i9pF/JKGIEtO7T37suXLna0di64AImSYtFh91nBcuRbumdGVGbJg5qGrlyPqc1XKjAKYOpEZ5z+y5ctYisWoe8Sq5bLgOp5KFyStdsY0YXB1a098gsZzgyfH/Fq+W4XHMDGg4ZhMZ2vx+VcuXovEmmO6//Z"
    ],
    "user_id": "tudogostoso_user",
    "views": 4800
  },
  {
    "id": "15",
    "nome": "Pavê de Bolacha com Creme de Chocolate",
    "categoria": "Pastelaria",
    "porcoes": 12,
    "ingredientes": [
      { "nome": "bolacha maisena", "quantidade": 2, "unidade": "pacotes" },
      { "nome": "leite condensado", "quantidade": 1, "unidade": "lata" },
      { "nome": "creme de leite", "quantidade": 1, "unidade": "lata" },
      { "nome": "gemas peneiradas", "quantidade": 2, "unidade": "unidades" },
      { "nome": "leite", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "amido de milho", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "chocolate em pó", "quantidade": 4, "unidade": "colheres de sopa" },
      { "nome": "leite para umedecer as bolachas", "quantidade": 1, "unidade": "xícara" }
    ],
    "preparo": [
      "Prepare o creme: em uma panela, misture o leite condensado, as gemas, o amido de milho dissolvido em um pouco de leite e o restante do leite. Leve ao fogo médio, mexendo sempre, até engrossar.",
      "Divida o creme em duas partes. Em uma delas, adicione o chocolate em pó e misture bem.",
      "Em ambas as partes, depois de amornar, incorpore metade do creme de leite em cada uma.",
      "Para a montagem: em um refratário, faça uma camada de creme branco. Umedeça as bolachas no leite e faça uma camada sobre o creme.",
      "Faça uma camada de creme de chocolate, seguida por outra camada de bolachas umedecidas. Repita até acabarem os ingredientes, finalizando com creme.",
      "Leve à geladeira por no mínimo 6 horas. Decore com raspas de chocolate antes de servir."
    ],
    "tempo": "30 min + 6h geladeira",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://www.alimentosluam.com.br/receitas/013df286544a8c6edfc74a55bc5c0ca7.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 5000
  },
  {
    "id": "16",
    "nome": "Coxinha de Frango com Massa de Batata",
    "categoria": "Culinária Geral",
    "porcoes": 25,
    "ingredientes": [
      { "nome": "peito de frango cozido e desfiado", "quantidade": 500, "unidade": "g" },
      { "nome": "caldo do cozimento do frango", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "batata cozida e espremida", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "farinha de trigo", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "manteiga", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "cebola e alho para o recheio", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "leite e ovos para empanar", "quantidade": 1, "unidade": "suficiente" },
      { "nome": "farinha de rosca para empanar", "quantidade": 2, "unidade": "xícaras" }
    ],
    "preparo": [
      "Prepare o recheio refogando o frango desfiado com temperos a gosto (cebola, alho, tomate, cheiro-verde). Deixe esfriar.",
      "Prepare a massa: em uma panela grande, aqueça o caldo de frango com a manteiga. Quando ferver, adicione a batata espremida e a farinha de trigo de uma vez.",
      "Cozinhe em fogo baixo, mexendo vigorosamente, até a massa desgrudar do fundo da panela. Deixe amornar.",
      "Sove a massa morna em uma superfície lisa. Pegue pequenas porções, abra na palma da mão, recheie e modele as coxinhas.",
      "Passe cada coxinha no leite (ou ovo batido) e depois na farinha de rosca.",
      "Frite em óleo quente até dourar por igual. Escorra em papel toalha."
    ],
    "tempo": "90 min",
    "dificuldade": "Difícil",
    "imagem_urls": [
      "https://s2-receitas.glbimg.com/mYz0hyJVJ1k-6BtbShqwKpwwLcg=/0x0:975x574/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2020/T/W/ufsOD7RJWvPswvIYzm0g/coxinha-de-batata-doce.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 5200
  },
  {
    "id": "17",
    "nome": "Escondidinho de Carne Seca com Mandioca",
    "categoria": "Culinária Geral",
    "porcoes": 8,
    "ingredientes": [
      { "nome": "carne seca dessalgada, cozida e desfiada", "quantidade": 500, "unidade": "g" },
      { "nome": "mandioca cozida e amassada", "quantidade": 1, "unidade": "kg" },
      { "nome": "cebola grande picada", "quantidade": 1, "unidade": "unidade" },
      { "nome": "tomate sem sementes picado", "quantidade": 2, "unidade": "unidades" },
      { "nome": "queijo coalho em cubos ou ralado", "quantidade": 200, "unidade": "g" },
      { "nome": "manteiga de garrafa (ou manteiga comum)", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "leite", "quantidade": 200, "unidade": "ml" },
      { "nome": "queijo parmesão ralado para gratinar", "quantidade": 50, "unidade": "g" }
    ],
    "preparo": [
      "Prepare o recheio: refogue a cebola na manteiga, adicione a carne seca desfiada e os tomates. Cozinhe por 10 minutos e reserve.",
      "Prepare o purê: misture a mandioca amassada com o leite e a manteiga. Leve ao fogo, mexendo até obter um purê cremoso. Tempere com sal se necessário.",
      "Montagem: em um refratário, espalhe a carne seca. Se usar queijo coalho em cubos, misture-o aqui. Se for ralado, espalhe por cima.",
      "Cubra com o purê de mandioca.",
      "Polvilhe queijo parmesão ralado e leve ao forno pré-aquecido a 200°C por 20-25 minutos, ou até gratinar."
    ],
    "tempo": "120 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://img.cybercook.com.br/imagens/receitas/850/escondidinho-de-carne-seca-1.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 5400
  },
  {
    "id": "18",
    "nome": "Quindim Tradicional",
    "categoria": "Pastelaria",
    "porcoes": 12,
    "ingredientes": [
      { "nome": "gemas de ovo peneiradas", "quantidade": 10, "unidade": "unidades" },
      { "nome": "açúcar refinado", "quantidade": 250, "unidade": "g" },
      { "nome": "coco ralado fresco (ou de pacote, hidratado)", "quantidade": 100, "unidade": "g" },
      { "nome": "manteiga sem sal derretida", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "leite de coco", "quantidade": 50, "unidade": "ml" }
    ],
    "preparo": [
      "Pré-aqueça o forno a 180°C. Unte forminhas individuais de quindim com bastante manteiga e polvilhe açúcar.",
      "Em uma tigela, misture o açúcar e o coco ralado. Adicione a manteiga derretida, o leite de coco e as gemas peneiradas.",
      "Misture delicadamente, sem bater, apenas para incorporar todos os ingredientes.",
      "Distribua a mistura nas forminhas preparadas.",
      "Asse em banho-maria por cerca de 40-50 minutos, ou até que a superfície esteja firme e dourada.",
      "Deixe amornar para desenformar."
    ],
    "tempo": "70 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu9e71umocoeXJn2u_s4fNaTecrcK87CssOg&s"
    ],
    "user_id": "tudogostoso_user",
    "views": 5600
  },
  {
    "id": "19",
    "nome": "Bolo de Milho Cremoso de Liquidificador",
    "categoria": "Pastelaria",
    "porcoes": 12,
    "ingredientes": [
      { "nome": "milho verde em lata (com a água)", "quantidade": 1, "unidade": "lata" },
      { "nome": "leite condensado", "quantidade": 1, "unidade": "lata" },
      { "nome": "leite (use a lata como medida)", "quantidade": 1, "unidade": "lata" },
      { "nome": "ovos", "quantidade": 3, "unidade": "unidades" },
      { "nome": "manteiga derretida", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "fubá mimoso", "quantidade": 4, "unidade": "colheres de sopa" },
      { "nome": "fermento em pó", "quantidade": 1, "unidade": "colher de sopa" }
    ],
    "preparo": [
      "Pré-aqueça o forno a 180°C. Unte e enfarinhe uma forma redonda com furo no meio.",
      "No liquidificador, bata todos os ingredientes (exceto o fermento) por cerca de 3 minutos, até a mistura ficar bem lisa.",
      "Adicione o fermento e pulse apenas para misturar.",
      "Despeje a massa na forma. A massa é bem líquida, é normal.",
      "Asse por aproximadamente 40-50 minutos, ou até dourar e firmar. O centro ficará cremoso.",
      "Espere esfriar completamente para desenformar."
    ],
    "tempo": "60 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTltkf-npNuUtqZMyqeVVEdR4ck5dBWs6vNyQ&s"
    ],
    "user_id": "tudogostoso_user",
    "views": 5800
  },
  {
    "id": "20",
    "nome": "Feijoada Completa",
    "categoria": "Culinária Geral",
    "porcoes": 10,
    "ingredientes": [
      { "nome": "feijão preto", "quantidade": 1, "unidade": "kg" },
      { "nome": "carne seca", "quantidade": 300, "unidade": "g" },
      { "nome": "costelinha de porco salgada", "quantidade": 300, "unidade": "g" },
      { "nome": "lombo de porco salgado", "quantidade": 200, "unidade": "g" },
      { "nome": "linguiça paio", "quantidade": 200, "unidade": "g" },
      { "nome": "linguiça calabresa", "quantidade": 200, "unidade": "g" },
      { "nome": "bacon em cubos", "quantidade": 150, "unidade": "g" },
      { "nome": "cebola grande picada", "quantidade": 2, "unidade": "unidades" },
      { "nome": "alho picado", "quantidade": 6, "unidade": "dentes" },
      { "nome": "folhas de louro", "quantidade": 4, "unidade": "unidades" },
      { "nome": "laranja (para cozinhar junto)", "quantidade": 1, "unidade": "unidade" }
    ],
    "preparo": [
      "Na véspera, deixe as carnes salgadas de molho em água, trocando a água a cada 4 horas para dessalgar. Deixe o feijão de molho também.",
      "No dia, cozinhe o feijão em uma panela de pressão grande com água e as folhas de louro.",
      "Em outra panela, cozinhe as carnes dessalgadas até ficarem macias, começando pelas mais duras (carne seca) e adicionando as outras depois.",
      "Quando as carnes estiverem macias, junte-as ao feijão cozido. Adicione as linguiças e a laranja inteira (com casca). Cozinhe em fogo baixo até o caldo engrossar.",
      "Em uma frigideira, frite o bacon. Retire e reserve. Na gordura do bacon, doure a cebola e o alho e adicione à panela da feijoada. Cozinhe por mais 30 minutos.",
      "Ajuste o sal se necessário. Sirva com arroz branco, couve refogada, farofa e rodelas de laranja."
    ],
    "tempo": "180 min",
    "dificuldade": "Difícil",
    "imagem_urls": [
      "https://compactaprint.com.br/wp-content/uploads/2025/06/Receita-de-Feijoada-Completa-Simples-e-Saborosa-na-sua-Mesa.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 2800
  },
  {
    "id": "21",
    "nome": "Pão de Queijo Mineiro Tradicional",
    "categoria": "Pastelaria",
    "porcoes": 30,
    "ingredientes": [
      { "nome": "polvilho azedo", "quantidade": 500, "unidade": "g" },
      { "nome": "leite", "quantidade": 250, "unidade": "ml" },
      { "nome": "óleo", "quantidade": 100, "unidade": "ml" },
      { "nome": "água", "quantidade": 100, "unidade": "ml" },
      { "nome": "ovos", "quantidade": 2, "unidade": "unidades" },
      { "nome": "queijo minas meia cura ralado", "quantidade": 300, "unidade": "g" },
      { "nome": "sal", "quantidade": 1, "unidade": "colher de chá" }
    ],
    "preparo": [
      "Em uma panela, ferva o leite, a água, o óleo e o sal.",
      "Coloque o polvilho em uma tigela grande e despeje a mistura fervente por cima, escaldando o polvilho. Misture bem com uma colher até amornar.",
      "Quando a massa estiver morna, adicione os ovos um a um, sovando bem a cada adição.",
      "Por último, acrescente o queijo ralado e misture até incorporar completamente.",
      "Unte as mãos com óleo, faça bolinhas e coloque em uma assadeira, deixando espaço entre elas.",
      "Asse em forno pré-aquecido a 200°C por cerca de 25-30 minutos, ou até crescerem e dourarem."
    ],
    "tempo": "50 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://img.freepik.com/fotos-premium/lanche-brasileiro-pao-de-queijo-tradicional-mineiro-pao-de-queijo-com-cafe-e-bolo-de-milho_538646-11103.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 2900
  },
  {
    "id": "22",
    "nome": "Moqueca Baiana de Peixe",
    "categoria": "Culinária Geral",
    "porcoes": 6,
    "ingredientes": [
      { "nome": "postas de peixe branco firme (cação, robalo)", "quantidade": 1, "unidade": "kg" },
      { "nome": "cebola grande em rodelas", "quantidade": 1, "unidade": "unidade" },
      { "nome": "pimentão vermelho em rodelas", "quantidade": 1, "unidade": "unidade" },
      { "nome": "pimentão amarelo em rodelas", "quantidade": 1, "unidade": "unidade" },
      { "nome": "tomates maduros em rodelas", "quantidade": 3, "unidade": "unidades" },
      { "nome": "leite de coco", "quantidade": 400, "unidade": "ml" },
      { "nome": "azeite de dendê", "quantidade": 3, "unidade": "colheres de sopa" },
      { "nome": "suco de limão, sal e pimenta do reino", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "coentro e cebolinha picados", "quantidade": 1, "unidade": "maço" }
    ],
    "preparo": [
      "Tempere o peixe com sal, pimenta e suco de limão. Deixe marinar por 30 minutos.",
      "Em uma panela de barro (ou panela grande), faça uma camada com metade da cebola, dos pimentões e dos tomates.",
      "Acomode as postas de peixe sobre essa camada.",
      "Cubra o peixe com o restante da cebola, pimentões e tomates.",
      "Regue com o leite de coco e o azeite de dendê. Salpique metade do coentro e da cebolinha.",
      "Leve ao fogo médio e, quando começar a ferver, abaixe o fogo. Cozinhe com a panela semi-tampada por 20-25 minutos, sem mexer.",
      "Finalize com o restante do coentro e cebolinha. Sirva com arroz branco e pirão."
    ],
    "tempo": "45 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://i.pinimg.com/736x/b2/57/ae/b257aeb4f86db8d13f55b60f72b51b06.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3000
  },
  {
    "id": "23",
    "nome": "Brigadeiro Gourmet",
    "categoria": "Pastelaria",
    "porcoes": 30,
    "ingredientes": [
      { "nome": "leite condensado de boa qualidade", "quantidade": 1, "unidade": "lata" },
      { "nome": "creme de leite (17% de gordura)", "quantidade": 100, "unidade": "g" },
      { "nome": "chocolate em barra 50% cacau, picado", "quantidade": 100, "unidade": "g" },
      { "nome": "manteiga sem sal", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "confeitos de chocolate belga para decorar", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Em uma panela de fundo grosso, derreta a manteiga. Adicione o leite condensado, o creme de leite e o chocolate picado.",
      "Cozinhe em fogo médio-baixo, mexendo constantemente, até a massa atingir o ponto de brigadeiro (desgrudando do fundo da panela), cerca de 12 minutos.",
      "Transfira a massa para um prato untado com manteiga e cubra com plástico filme em contato com a massa.",
      "Deixe esfriar completamente (idealmente, 6 horas em temperatura ambiente).",
      "Com as mãos levemente untadas, enrole os brigadeiros, passe nos confeitos belgas e coloque em forminhas."
    ],
    "tempo": "25 min + 6h de descanso",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://www.oitedi.com.br/_next/image?url=https%3A%2F%2Ftedi-production.s3.amazonaws.com%2Fcooking_recipes%2Ffood_description%2F4b9d69cca10e5a7a87c8cb5153dd6ca1b31a710f.png&w=1080&q=70"
    ],
    "user_id": "tudogostoso_user",
    "views": 3100
  },
  {
    "id": "24",
    "nome": "Bolo de Fubá com Goiabada",
    "categoria": "Pastelaria",
    "porcoes": 12,
    "ingredientes": [
      { "nome": "ovos", "quantidade": 3, "unidade": "unidades" },
      { "nome": "leite", "quantidade": 1, "unidade": "xícara" },
      { "nome": "óleo", "quantidade": 0.5, "unidade": "xícara" },
      { "nome": "açúcar", "quantidade": 1.5, "unidade": "xícaras" },
      { "nome": "fubá mimoso", "quantidade": 1.5, "unidade": "xícaras" },
      { "nome": "farinha de trigo", "quantidade": 0.5, "unidade": "xícara" },
      { "nome": "fermento em pó", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "goiabada em cubos", "quantidade": 200, "unidade": "g" }
    ],
    "preparo": [
      "Pré-aqueça o forno a 180°C. Unte e enfarinhe uma forma com furo central.",
      "No liquidificador, bata os ovos, o leite, o óleo e o açúcar.",
      "Adicione o fubá e a farinha e bata até obter uma massa lisa.",
      "Incorpore o fermento e pulse rapidamente.",
      "Passe os cubos de goiabada na farinha de trigo (isso ajuda a não afundarem na massa).",
      "Despeje metade da massa na forma, distribua os cubos de goiabada e cubra com o restante da massa.",
      "Asse por cerca de 40 minutos, ou até dourar e o palito sair limpo."
    ],
    "tempo": "50 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://receiterapia.com.br/wp-content/webp-express/webp-images/uploads/2024/11/Qual-o-Segredo-para-Fazer-Bolo-de-Fuba-com-Goiabada-Sem-Afundar.jpg.webp"
    ],
    "user_id": "tudogostoso_user",
    "views": 3200
  },
  {
    "id": "25",
    "nome": "Frango à Passarinho",
    "categoria": "Culinária Geral",
    "porcoes": 4,
    "ingredientes": [
      { "nome": "frango cortado em pedaços pequenos (a passarinho)", "quantidade": 1, "unidade": "kg" },
      { "nome": "alho picado ou amassado", "quantidade": 6, "unidade": "dentes" },
      { "nome": "suco de limão", "quantidade": 1, "unidade": "unidade" },
      { "nome": "sal e pimenta do reino", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "óleo para fritura por imersão", "quantidade": 1, "unidade": "suficiente" },
      { "nome": "salsinha picada para finalizar", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Tempere os pedaços de frango com alho, limão, sal e pimenta. Deixe marinar na geladeira por pelo menos 1 hora.",
      "Aqueça o óleo em uma panela funda. O óleo deve ser suficiente para cobrir os pedaços de frango.",
      "Frite os pedaços de frango aos poucos, para não esfriar o óleo, até que estejam bem dourados e cozidos por dentro.",
      "Retire com uma escumadeira e escorra em papel toalha.",
      "Em uma frigideira separada, frite mais um pouco de alho picado em azeite até dourar e ficar crocante.",
      "Sirva o frango frito com o alho crocante e a salsinha picada por cima."
    ],
    "tempo": "35 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://i.ytimg.com/vi/hDFh7LqkTcU/sddefault.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3300
  },
  {
    "id": "26",
    "nome": "Cuscuz Paulista",
    "categoria": "Culinária Geral",
    "porcoes": 8,
    "ingredientes": [
      { "nome": "farinha de milho em flocos", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "sardinha em lata (ou frango desfiado)", "quantidade": 2, "unidade": "latas" },
      { "nome": "ovos cozidos em rodelas", "quantidade": 3, "unidade": "unidades" },
      { "nome": "palmito picado", "quantidade": 1, "unidade": "vidro" },
      { "nome": "ervilha e milho", "quantidade": 1, "unidade": "lata" },
      { "nome": "molho de tomate", "quantidade": 1, "unidade": "xícara" },
      { "nome": "cebola, alho, pimentão e cheiro-verde", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Decore o fundo e as laterais de uma forma de furo central com rodelas de ovo, tomate, sardinha e palmito. Reserve.",
      "Em uma panela, refogue os temperos (cebola, alho, pimentão). Adicione o restante da sardinha, palmito, ervilha, milho e o molho de tomate. Deixe ferver.",
      "Adicione cerca de 2 xícaras de água ou caldo de legumes e deixe ferver novamente. Ajuste o sal.",
      "Umedeça a farinha de milho com um pouco de água e vá adicionando ao refogado fervente, mexendo sempre, até formar uma massa cozida e úmida.",
      "Despeje a massa na forma decorada, apertando levemente para compactar.",
      "Deixe esfriar e desenforme. Sirva em temperatura ambiente."
    ],
    "tempo": "60 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://www.alambarialimentos.com.br/wp-content/uploads/2020/05/cuzcuz-848x590.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3400
  },
  {
    "id": "27",
    "nome": "Bolo de Rolo",
    "categoria": "Pastelaria",
    "porcoes": 15,
    "ingredientes": [
      { "nome": "manteiga sem sal", "quantidade": 250, "unidade": "g" },
      { "nome": "açúcar", "quantidade": 250, "unidade": "g" },
      { "nome": "gemas", "quantidade": 6, "unidade": "unidades" },
      { "nome": "claras em neve", "quantidade": 6, "unidade": "unidades" },
      { "nome": "farinha de trigo", "quantidade": 250, "unidade": "g" },
      { "nome": "goiabada cremosa derretida", "quantidade": 500, "unidade": "g" }
    ],
    "preparo": [
      "Bata a manteiga com o açúcar até formar um creme branco. Adicione as gemas uma a uma.",
      "Peneire a farinha e adicione à mistura, alternando com as claras em neve, delicadamente.",
      "Pré-aqueça o forno a 210°C. Unte e enfarinhe 5 assadeiras retangulares (formato de rocambole).",
      "Espalhe uma camada muito fina da massa em cada assadeira.",
      "Asse por 5 minutos cada uma, apenas para firmar. A massa deve ficar branca.",
      "Desenforme a primeira massa sobre um pano de prato úmido, espalhe uma camada fina de goiabada e enrole como um rocambole bem apertado.",
      "Desenforme a segunda massa, espalhe goiabada e coloque o primeiro rolinho na ponta, continuando a enrolar. Repita com todas as massas.",
      "Ao final, polvilhe açúcar de confeiteiro."
    ],
    "tempo": "70 min",
    "dificuldade": "Difícil",
    "imagem_urls": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkkfJtHtfsefoaWcqEcmCIQUgfyjolzW--FQ&s"
    ],
    "user_id": "tudogostoso_user",
    "views": 3500
  },
  {
    "id": "28",
    "nome": "Vaca Atolada",
    "categoria": "Culinária Geral",
    "porcoes": 6,
    "ingredientes": [
      { "nome": "costela bovina em pedaços", "quantidade": 1.5, "unidade": "kg" },
      { "nome": "mandioca em pedaços", "quantidade": 1, "unidade": "kg" },
      { "nome": "cebola picada", "quantidade": 2, "unidade": "unidades" },
      { "nome": "alho picado", "quantidade": 4, "unidade": "dentes" },
      { "nome": "tomates picados", "quantidade": 3, "unidade": "unidades" },
      { "nome": "cheiro-verde picado", "quantidade": 1, "unidade": "maço" }
    ],
    "preparo": [
      "Tempere a costela com sal e pimenta. Em uma panela de pressão, doure a costela dos dois lados.",
      "Adicione a cebola e o alho e refogue. Junte os tomates e refogue mais um pouco.",
      "Cubra com água quente, tampe a panela e cozinhe por 40 minutos após pegar pressão.",
      "Retire a pressão, abra a panela e adicione a mandioca.",
      "Se necessário, adicione mais água. Cozinhe (sem pressão ou com, por menos tempo) até a mandioca ficar bem macia, quase desmanchando, e o caldo engrossar.",
      "Finalize com cheiro-verde e sirva com arroz branco."
    ],
    "tempo": "120 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://painacozinha.com/wp-content/uploads/29.Vaca-Atolada.webp"
      "https://espaconatelie.com.br/wp-content/uploads/2025/03/vaca-atolada.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3600
  },
  {
    "id": "29",
    "nome": "Canjica Doce Cremosa",
    "categoria": "Pastelaria",
    "porcoes": 8,
    "ingredientes": [
      { "nome": "milho para canjica", "quantidade": 500, "unidade": "g" },
      { "nome": "leite", "quantidade": 1, "unidade": "litro" },
      { "nome": "leite de coco", "quantidade": 200, "unidade": "ml" },
      { "nome": "leite condensado", "quantidade": 1, "unidade": "lata" },
      { "nome": "açúcar", "quantidade": 1, "unidade": "xícara" },
      { "nome": "coco ralado", "quantidade": 50, "unidade": "g" },
      { "nome": "canela em pau e cravos", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Deixe a canjica de molho em água por pelo menos 12 horas.",
      "Escorra a água e cozinhe a canjica na panela de pressão com nova água (cobrindo uns 4 dedos acima dos grãos) por cerca de 40 minutos, até ficar macia.",
      "Retire a pressão, escorra a maior parte da água e adicione o leite, o leite de coco, o leite condensado, o açúcar, o coco, a canela e os cravos.",
      "Cozinhe em fogo baixo, mexendo de vez em quando, por mais 30 minutos, até o caldo engrossar e ficar bem cremoso.",
      "Sirva quente ou fria."
    ],
    "tempo": "80 min + molho",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://d21wiczbqxib04.cloudfront.net/Nyfsx5-XehzU5mYe5JJrGSKX6yM=/0x375/smart/https://osuper-ecommerce-boza.s3.sa-east-1.amazonaws.com/42fd9ad7-canjica.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3700
  },
  {
    "id": "30",
    "nome": "Salada de Maionese de Festa",
    "categoria": "Culinária Geral",
    "porcoes": 8,
    "ingredientes": [
      { "nome": "batatas grandes cozidas e em cubos", "quantidade": 4, "unidade": "unidades" },
      { "nome": "cenouras cozidas e em cubos", "quantidade": 2, "unidade": "unidades" },
      { "nome": "ervilhas em conserva ou congeladas", "quantidade": 1, "unidade": "lata" },
      { "nome": "maçã verde em cubos (opcional)", "quantidade": 1, "unidade": "unidade" },
      { "nome": "maionese de boa qualidade", "quantidade": 250, "unidade": "g" },
      { "nome": "ovos cozidos picados", "quantidade": 2, "unidade": "unidades" },
      { "nome": "azeitonas picadas", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "sal, pimenta e cheiro-verde", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Cozinhe as batatas e as cenouras em água e sal até ficarem macias, mas sem desmanchar. Escorra e deixe esfriar completamente.",
      "Em uma tigela grande, misture delicadamente as batatas, as cenouras, a ervilha, a maçã (se usar), os ovos e as azeitonas.",
      "Adicione a maionese e misture bem. Tempere com sal, pimenta e cheiro-verde.",
      "Leve à geladeira por pelo menos 1 hora antes de servir para apurar o sabor."
    ],
    "tempo": "30 min + refrigeração",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQI1DItF-vD8VtcKpCLkefN-Eoj4m5_Mv7D3w&s"
      
    ],
    "user_id": "tudogostoso_user",
    "views": 3800
  },
  {
    "id": "31",
    "nome": "Pastel de Feira (Carne)",
    "categoria": "Culinária Geral",
    "porcoes": 10,
    "ingredientes": [
      { "nome": "massa de pastel de rolo", "quantidade": 500, "unidade": "g" },
      { "nome": "carne moída", "quantidade": 400, "unidade": "g" },
      { "nome": "cebola e alho picados", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "ovo cozido picado", "quantidade": 1, "unidade": "unidade" },
      { "nome": "azeitonas picadas", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "óleo para fritar", "quantidade": 1, "unidade": "litro" }
    ],
    "preparo": [
      "Prepare o recheio: refogue a carne moída com cebola e alho. Adicione sal, pimenta e outros temperos a gosto. Depois de cozida, misture o ovo e as azeitonas. Deixe esfriar.",
      "Abra a massa de pastel, coloque uma porção do recheio frio.",
      "Dobre a massa e feche as bordas com a ajuda de um garfo.",
      "Frite em óleo bem quente até que os pastéis fiquem dourados e estufados.",
      "Escorra em papel toalha e sirva imediatamente."
    ],
    "tempo": "30 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://receitatodahora.com.br/wp-content/uploads/2022/03/pastel-de-carne1-1200x900.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 3900
  },
  {
    "id": "32",
    "nome": "Mousse de Maracujá Fácil",
    "categoria": "Pastelaria",
    "porcoes": 8,
    "ingredientes": [
      { "nome": "leite condensado", "quantidade": 1, "unidade": "lata" },
      { "nome": "creme de leite", "quantidade": 1, "unidade": "lata" },
      { "nome": "suco de maracujá concentrado (mesma medida da lata)", "quantidade": 1, "unidade": "lata" },
      { "nome": "polpa de 1 maracujá fresco para decorar", "quantidade": 1, "unidade": "unidade" }
    ],
    "preparo": [
      "No liquidificador, bata o leite condensado, o creme de leite e o suco de maracujá por 3 minutos.",
      "A mistura vai engrossar e ficar bem cremosa.",
      "Despeje em uma travessa ou em taças individuais.",
      "Leve à geladeira por pelo menos 2 horas.",
      "Antes de servir, decore com a polpa do maracujá fresco."
    ],
    "tempo": "15 min + refrigeração",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://img.cybercook.com.br/receitas/355/mousse-de-maracuja-liquidificador-2-840x480.jpeg?q=75"
      
    ],
    "user_id": "tudogostoso_user",
    "views": 4000
  },
  {
    "id": "33",
    "nome": "Risoto de Camarão",
    "categoria": "Culinária Geral",
    "porcoes": 3,
    "ingredientes": [
      { "nome": "arroz arbóreo ou carnaroli", "quantidade": 1.5, "unidade": "xícaras" },
      { "nome": "camarões limpos", "quantidade": 400, "unidade": "g" },
      { "nome": "cebola picada", "quantidade": 1, "unidade": "unidade" },
      { "nome": "vinho branco seco", "quantidade": 0.5, "unidade": "xícara" },
      { "nome": "caldo de legumes quente", "quantidade": 1, "unidade": "litro" },
      { "nome": "queijo parmesão ralado", "quantidade": 100, "unidade": "g" },
      { "nome": "manteiga gelada", "quantidade": 2, "unidade": "colheres de sopa" }
    ],
    "preparo": [
      "Tempere os camarões com sal e pimenta. Salteie-os rapidamente em uma frigideira com azeite e reserve.",
      "Na mesma panela, refogue a cebola na manteiga até ficar transparente. Adicione o arroz e frite por 1 minuto (nacarar).",
      "Adicione o vinho e mexa até evaporar.",
      "Comece a adicionar o caldo de legumes quente, uma concha de cada vez, mexendo sempre e esperando o líquido ser absorvido antes de adicionar a próxima.",
      "Cozinhe por cerca de 18 minutos, até o arroz estar al dente. Adicione os camarões reservados no último minuto.",
      "Desligue o fogo, adicione o queijo parmesão e a manteiga gelada. Mexa vigorosamente para dar cremosidade (mantecare). Sirva imediatamente."
    ],
    "tempo": "40 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://www.receiteria.com.br/wp-content/uploads/risoto-de-camarao-14.jpg",
      "https://msabores.com/wp-content/uploads/2024/08/arroz-carreteiro.webp",
      "https://i.panelinha.com.br/i1/bk-1581-panelinha-03-09-21-319.webp"
    ],
    "user_id": "tudogostoso_user",
    "views": 4100
  },
  {
    "id": "34",
    "nome": "Torta Holandesa",
    "categoria": "Pastelaria",
    "porcoes": 10,
    "ingredientes": [
      { "nome": "bolacha maisena triturada", "quantidade": 200, "unidade": "g" },
      { "nome": "manteiga derretida", "quantidade": 100, "unidade": "g" },
      { "nome": "bolacha Calipso para a lateral", "quantidade": 1, "unidade": "pacote" },
      { "nome": "creme de leite fresco", "quantidade": 500, "unidade": "ml" },
      { "nome": "leite condensado", "quantidade": 1, "unidade": "lata" },
      { "nome": "cream cheese", "quantidade": 150, "unidade": "g" },
      { "nome": "chocolate meio amargo para a ganache", "quantidade": 150, "unidade": "g" },
      { "nome": "creme de leite para a ganache", "quantidade": 150, "unidade": "g" }
    ],
    "preparo": [
      "Misture a bolacha triturada com a manteiga derretida. Forre o fundo de uma forma de fundo removível (20cm).",
      "Disponha as bolachas Calipso na lateral da forma, com o chocolate virado para fora.",
      "Prepare o creme: bata o creme de leite fresco em ponto de chantilly. Em outra tigela, bata o cream cheese com o leite condensado. Incorpore o chantilly delicadamente.",
      "Despeje o creme na forma e leve ao freezer por 2 horas.",
      "Prepare a ganache: derreta o chocolate com o creme de leite. Deixe esfriar e despeje sobre a torta congelada.",
      "Leve à geladeira até a hora de servir."
    ],
    "tempo": "50 min + congelamento",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://www.tendaatacado.com.br/dicas/wp-content/uploads/2022/02/torta-holandesa.jpg",
      "https://cdn.awsli.com.br/2500x2500/2658/2658919/produto/252525853/fatia-de-torta-holandesa-vegana-sem-gl-ten-63z4ibw4sb.png",
      "https://i.ytimg.com/vi/rMaIusT5ApY/maxresdefault.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4200
  },
  {
    "id": "35",
    "nome": "Lasanha à Bolonhesa Clássica",
    "categoria": "Culinária Geral",
    "porcoes": 8,
    "ingredientes": [
      { "nome": "massa para lasanha (pré-cozida ou fresca)", "quantidade": 500, "unidade": "g" },
      { "nome": "carne moída", "quantidade": 500, "unidade": "g" },
      { "nome": "molho de tomate", "quantidade": 2, "unidade": "latas" },
      { "nome": "presunto fatiado", "quantidade": 300, "unidade": "g" },
      { "nome": "mussarela fatiada", "quantidade": 400, "unidade": "g" },
      { "nome": "leite para molho branco", "quantidade": 1, "unidade": "litro" },
      { "nome": "manteiga para molho branco", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "farinha de trigo para molho branco", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "noz-moscada, sal e pimenta", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Prepare o molho bolonhesa: refogue a carne moída com temperos, adicione o molho de tomate e cozinhe por 20 minutos.",
      "Prepare o molho branco: derreta a manteiga, adicione a farinha e cozinhe por 1 minuto. Adicione o leite aos poucos, mexendo sempre para não empelotar. Tempere com sal, pimenta e noz-moscada.",
      "Montagem: em um refratário, comece com uma camada de molho bolonhesa. Alterne camadas de massa, presunto, queijo, molho branco e molho bolonhesa.",
      "Finalize com uma camada de mussarela e queijo parmesão ralado.",
      "Cubra com papel alumínio e asse em forno pré-aquecido a 180°C por 30 minutos. Retire o papel e asse por mais 15 minutos para gratinar."
    ],
    "tempo": "75 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://italiatua.com.br/wp-content/uploads/2019/10/lazanha1-1024x683.jpg",
      "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2022/07/lasanha_zona_sul_destaque.jpg",
      "https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2022/07/lasanha_bolonhesa_zona_Sul_ilustrativa.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4300
  },
  {
    "id": "36",
    "nome": "Arroz Carreteiro",
    "categoria": "Culinária Geral",
    "porcoes": 5,
    "ingredientes": [
      { "nome": "arroz", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "carne seca dessalgada, cozida e desfiada", "quantidade": 300, "unidade": "g" },
      { "nome": "bacon em cubos", "quantidade": 150, "unidade": "g" },
      { "nome": "linguiça calabresa em rodelas", "quantidade": 1, "unidade": "unidade" },
      { "nome": "cebola e alho picados", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "tomate e pimentão picados", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Em uma panela, frite o bacon até dourar. Adicione a calabresa e frite mais um pouco. Reserve.",
      "Na mesma panela, refogue a cebola e o alho. Adicione o pimentão e o tomate.",
      "Junte a carne seca e refogue bem. Adicione o arroz e frite por 2 minutos.",
      "Cubra com água quente (o dobro do volume do arroz), adicione o bacon e a calabresa reservados, ajuste o sal e cozinhe em fogo baixo com a panela semi-tampada até a água secar.",
      "Finalize com cheiro-verde picado."
    ],
    "tempo": "50 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://s2-g1.glbimg.com/jjClKkWxdfFZwyB0813r4ENgBwo=/0x0:2000x1126/1008x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/l/2/cJdLvqQiSVKbQBAFLcDg/arroz-carreteiro-21-.jpg",
      "https://msabores.com/wp-content/uploads/2024/08/arroz-carreteiro.webp",
      "https://www.nacozinhadahelo.com.br/wp-content/uploads/2022/09/receita-de-arroz-de-carreteiro.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4400
  },
  {
    "id": "37",
    "nome": "Empadinha de Palmito",
    "categoria": "Culinária Geral",
    "porcoes": 12,
    "ingredientes": [
      { "nome": "farinha de trigo (massa)", "quantidade": 3, "unidade": "xícaras" },
      { "nome": "manteiga ou margarina gelada (massa)", "quantidade": 200, "unidade": "g" },
      { "nome": "gema de ovo (massa)", "quantidade": 1, "unidade": "unidade" },
      { "nome": "sal (massa)", "quantidade": 1, "unidade": "colher de chá" },
      { "nome": "palmito picado (recheio)", "quantidade": 1, "unidade": "vidro" },
      { "nome": "cebola, alho, tomate (recheio)", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "requeijão cremoso (recheio)", "quantidade": 2, "unidade": "colheres de sopa" }
    ],
    "preparo": [
      "Massa: misture a farinha e o sal. Adicione a manteiga gelada em cubos e trabalhe com a ponta dos dedos até formar uma farofa. Junte a gema e misture até a massa ligar (não sove). Embrulhe em plástico e gele por 30 minutos.",
      "Recheio: refogue os temperos, junte o palmito e um pouco de molho de tomate. Cozinhe e, no final, adicione o requeijão para dar cremosidade. Deixe esfriar.",
      "Montagem: forre forminhas de empada com a massa, recheie e cubra com um disco de massa.",
      "Pincele com gema e asse em forno pré-aquecido a 180°C por 30 minutos, ou até dourar."
    ],
    "tempo": "60 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://www.unileverfoodsolutions.com.br/dam/global-ufs/mcos/SLA/calcmenu/recipes/BR-recipes/desserts-&-bakery/torta-holandesa/main-header.jpg",
      "https://guiadacozinha.com.br/wp-content/uploads/2019/10/empadinha-cremosa-de-palmito-768x619.jpg",
      "https://benditosalgado.com.br/wp-content/uploads/2022/06/Empada-Palmito.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4500
  },
  {
    "id": "38",
    "nome": "Doce de Leite Caseiro na Panela",
    "categoria": "Pastelaria",
    "porcoes": 10,
    "ingredientes": [
      { "nome": "leite integral fresco", "quantidade": 2, "unidade": "litros" },
      { "nome": "açúcar refinado", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "bicarbonato de sódio (para não talhar)", "quantidade": 1, "unidade": "colher de café" }
    ],
    "preparo": [
      "Em uma panela grande e alta (pois o leite sobe ao ferver), misture todos os ingredientes.",
      "Leve ao fogo alto, mexendo até o açúcar dissolver. Quando ferver, abaixe para o fogo médio-baixo.",
      "Cozinhe por aproximadamente 1 hora e 30 minutos, mexendo ocasionalmente para não grudar no fundo.",
      "O doce estará pronto quando engrossar e adquirir uma cor de caramelo. A consistência engrossa mais depois de frio.",
      "Transfira para um pote de vidro esterilizado e deixe esfriar."
    ],
    "tempo": "100 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://melepimenta.com/wp-content/uploads/2020/01/Doce-leite-caseiro-Baixa-6.jpg.webp",
      "https://catracalivre.com.br/wp-content/uploads/2023/03/istock-577654524.jpg",
      "https://i.panelinha.com.br/i1/bk-1673-doce-de-leite-de-panela-de-pressao.webp"
    ],
    "user_id": "tudogostoso_user",
    "views": 4600
  },
  {
    "id": "39",
    "nome": "Bolo Prestígio",
    "categoria": "Pastelaria",
    "porcoes": 12,
    "ingredientes": [
      { "nome": "ingredientes para bolo de chocolate", "quantidade": 1, "unidade": "receita" },
      { "nome": "leite condensado (recheio)", "quantidade": 1, "unidade": "lata" },
      { "nome": "coco ralado (recheio)", "quantidade": 100, "unidade": "g" },
      { "nome": "manteiga (recheio)", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "ingredientes para cobertura de brigadeiro", "quantidade": 1, "unidade": "receita" }
    ],
    "preparo": [
      "Prepare uma receita de bolo de chocolate (como a receita #5) e deixe esfriar.",
      "Prepare o recheio (beijinho): leve ao fogo o leite condensado, a manteiga e o coco ralado, mexendo até desgrudar do fundo da panela. Deixe esfriar.",
      "Prepare a cobertura de brigadeiro (como a da receita #1).",
      "Corte o bolo de chocolate ao meio, recheie com o creme de coco.",
      "Cubra o bolo com o brigadeiro e decore com coco ralado ou chocolate granulado."
    ],
    "tempo": "70 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://anamariabrogui.com.br/assets/uploads/receitas/fotos/usuario-2402-43e3f7089935ec3a355665c9beaf9d8d.jpg",
      "https://i.ytimg.com/vi/Ai19xOmWNQM/maxresdefault.jpg",
      "https://confeitando.com.br/wp-content/uploads/2017/05/bolo_prestigio_receita.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4700
  },
  {
    "id": "40",
    "nome": "Strogonoff de Frango Brasileiro",
    "categoria": "Culinária Geral",
    "porcoes": 4,
    "ingredientes": [
      { "nome": "filé de frango em tiras ou cubos", "quantidade": 500, "unidade": "g" },
      { "nome": "cebola e alho picados", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "champignon fatiado", "quantidade": 100, "unidade": "g" },
      { "nome": "ketchup", "quantidade": 3, "unidade": "colheres de sopa" },
      { "nome": "mostarda", "quantidade": 1, "unidade": "colher de sopa" },
      { "nome": "creme de leite", "quantidade": 1, "unidade": "lata" }
    ],
    "preparo": [
      "Tempere e doure o frango em uma panela com azeite. Reserve.",
      "Na mesma panela, refogue a cebola e o alho. Adicione o champignon e refogue.",
      "Volte com o frango para a panela, adicione o ketchup e a mostarda e misture bem.",
      "Desligue o fogo, adicione o creme de leite e incorpore delicadamente.",
      "Aqueça sem deixar ferver e sirva imediatamente com arroz branco e batata palha."
    ],
    "tempo": "30 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://static.itdg.com.br/images/1200-630/718720d37317540f51d0b3688a055b77/212990-original.jpg",
      "https://www.adoro.com.br/wp-content/uploads/2022/02/Strogonoff-Frango.png",
      "https://www.minhareceita.com.br/app/uploads/2022/03/estrogonofe-de-frango-seara.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4800
  },
  {
    "id": "41",
    "nome": "Pão Doce com Calda de Leite Condensado",
    "categoria": "Pastelaria",
    "porcoes": 8,
    "ingredientes": [
      { "nome": "farinha de trigo", "quantidade": 500, "unidade": "g" },
      { "nome": "fermento biológico seco", "quantidade": 10, "unidade": "g" },
      { "nome": "leite morno", "quantidade": 250, "unidade": "ml" },
      { "nome": "açúcar", "quantidade": 4, "unidade": "colheres de sopa" },
      { "nome": "ovo", "quantidade": 1, "unidade": "unidade" },
      { "nome": "manteiga", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "leite condensado e coco ralado para cobertura", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Ative o fermento no leite morno com uma colher de açúcar.",
      "Misture os demais ingredientes da massa (exceto cobertura) e sove por 10 minutos.",
      "Deixe a massa crescer por 1 hora.",
      "Modele os pães, coloque em uma forma e deixe crescer por mais 30 minutos.",
      "Asse em forno pré-aquecido a 180°C por 30 minutos.",
      "Pincele leite condensado sobre os pães ainda quentes e polvilhe coco ralado."
    ],
    "tempo": "120 min",
    "dificuldade": "Médio",
    "imagem_urls": [
     "https://i.ytimg.com/vi/oj06MlJ_x0Y/maxresdefault.jpg",
      "https://janacabral.com/wp-content/uploads/2025/02/PAO-DOCE-DE-LEITE-CONDENSADO-10-683x1024.webp",
      "https://s2-receitas.glbimg.com/b98KgoLbKAyFnCJkWoOVUyHUefo=/0x0:1000x649/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/l/2/Vg8pacQryAl86uSR6C5w/pao-doce-de-leite-condensado-e-coco.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 4900
  },
  {
    "id": "42",
    "nome": "Farofa de Bacon e Calabresa",
    "categoria": "Culinária Geral",
    "porcoes": 6,
    "ingredientes": [
      { "nome": "farinha de mandioca torrada", "quantidade": 500, "unidade": "g" },
      { "nome": "bacon em cubos", "quantidade": 200, "unidade": "g" },
      { "nome": "linguiça calabresa picada", "quantidade": 1, "unidade": "unidade" },
      { "nome": "cebola picada", "quantidade": 1, "unidade": "unidade" },
      { "nome": "manteiga", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "cheiro-verde picado", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Frite o bacon em sua própria gordura até ficar crocante. Retire e reserve.",
      "Na mesma panela, frite a calabresa. Retire e reserve.",
      "Adicione a manteiga à panela e refogue a cebola até dourar.",
      "Adicione a farinha de mandioca e mexa em fogo baixo por 5 minutos para torrar.",
      "Desligue o fogo, volte com o bacon e a calabresa, adicione o cheiro-verde e misture bem."
    ],
    "tempo": "20 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://www.receitasja.com.br/wp-content/uploads/2025/04/Farofa-de-Bacon-com-Calabresa.jpg",
      "https://guiadacozinha.com.br/wp-content/uploads/2018/07/Farofa-com-bacon-e-calabresa.jpg",
      "https://www.minhareceita.com.br/app/uploads/2022/06/farofa650.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 5000
  },
  {
    "id": "43",
    "nome": "Bolo de Banana Caramelada",
    "categoria": "Pastelaria",
    "porcoes": 12,
    "ingredientes": [
      { "nome": "bananas nanica maduras", "quantidade": 6, "unidade": "unidades" },
      { "nome": "ovos", "quantidade": 3, "unidade": "unidades" },
      { "nome": "açúcar", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "farinha de trigo", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "leite", "quantidade": 1, "unidade": "xícara" },
      { "nome": "manteiga", "quantidade": 3, "unidade": "colheres de sopa" },
      { "nome": "fermento em pó", "quantidade": 1, "unidade": "colher de sopa" }
    ],
    "preparo": [
      "Prepare o caramelo: derreta 1 xícara de açúcar em uma forma redonda até virar caramelo. Forre o fundo e as laterais. Distribua rodelas de 3 bananas sobre o caramelo.",
      "Prepare a massa: bata na batedeira a manteiga com o restante do açúcar e os ovos.",
      "Adicione a farinha, o leite e 3 bananas amassadas. Por último, o fermento.",
      "Despeje a massa na forma sobre as bananas e o caramelo.",
      "Asse em forno pré-aquecido a 180°C por 45 minutos.",
      "Desenforme ainda morno para o caramelo não endurecer."
    ],
    "tempo": "60 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
       "https://i.ytimg.com/vi/vnRx_KhriS0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAPo8vt3S-u37L_e0crmI5jou998A",
      "https://www.receiteria.com.br/wp-content/uploads/bolo-de-banana-caramelizada.jpg",
      "https://receitasbaratas.com.br/wp-content/uploads/2024/10/Bolo-de-Banana-Caramelizado-Fofinho-e-Umido.jpg"
    
    ],
    "user_id": "tudogostoso_user",
    "views": 5100
  },
  {
    "id": "44",
    "nome": "Bobó de Camarão",
    "categoria": "Culinária Geral",
    "porcoes": 4,
    "ingredientes": [
      { "nome": "camarões grandes limpos", "quantidade": 500, "unidade": "g" },
      { "nome": "mandioca cozida", "quantidade": 500, "unidade": "g" },
      { "nome": "leite de coco", "quantidade": 200, "unidade": "ml" },
      { "nome": "azeite de dendê", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "cebola, alho, pimentão, tomate e coentro", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Bata no liquidificador a mandioca cozida com a água do cozimento e o leite de coco até formar um creme.",
      "Em uma panela, refogue os temperos no azeite. Adicione o camarão e cozinhe até ficar rosado.",
      "Despeje o creme de mandioca na panela com os camarões, adicione o azeite de dendê e o coentro.",
      "Cozinhe por mais 10 minutos, mexendo sempre. Sirva com arroz branco."
    ],
    "tempo": "50 min",
    "dificuldade": "Médio",
    "imagem_urls": [
        
      "https://guiadacozinha.com.br/wp-content/uploads/2018/05/Bobo-de-camarao.jpg",
      "https://msabores.com/wp-content/uploads/2024/08/bobodecamarao.webp"
    ],
    "user_id": "tudogostoso_user",
    "views": 5200
  },
  {
    "id": "45",
    "nome": "Cocada Cremosa de Colher",
    "categoria": "Pastelaria",
    "porcoes": 15,
    "ingredientes": [
      { "nome": "coco fresco ralado grosso", "quantidade": 250, "unidade": "g" },
      { "nome": "leite condensado", "quantidade": 1, "unidade": "lata" },
      { "nome": "açúcar", "quantidade": 1, "unidade": "xícara" },
      { "nome": "leite", "quantidade": 100, "unidade": "ml" }
    ],
    "preparo": [
      "Em uma panela, misture todos os ingredientes.",
      "Leve ao fogo médio-baixo, mexendo sempre para não queimar.",
      "Cozinhe por cerca de 20 minutos, ou até que a mistura comece a se soltar do fundo da panela, mas ainda esteja cremosa.",
      "Sirva em copinhos ou use como recheio de bolos e tortas."
    ],
    "tempo": "25 min",
    "dificuldade": "Fácil",
    "imagem_urls": [
     "https://s2-receitas.glbimg.com/2gpN7537EPqVPI1m33zfqUgWGm0=/0x0:652x408/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2020/n/N/VBc9UESamgn4BUzBugOg/cocada-cremosa-de-colher.jpg",
      "https://i.ytimg.com/vi/zH8glvfeNWM/maxresdefault.jpg",
      "https://p2.trrsf.com/image/fget/cf/1200/630/middle/images.terra.com/2022/09/13/2115652830-cocada-de-colher-25840.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 5300
  },
  {
    "id": "46",
    "nome": "Vatapá Simples",
    "categoria": "Culinária Geral",
    "porcoes": 6,
    "ingredientes": [
      { "nome": "pães franceses amanhecidos", "quantidade": 4, "unidade": "unidades" },
      { "nome": "leite de coco", "quantidade": 400, "unidade": "ml" },
      { "nome": "camarão seco", "quantidade": 100, "unidade": "g" },
      { "nome": "amendoim torrado e moído", "quantidade": 50, "unidade": "g" },
      { "nome": "castanha de caju moída", "quantidade": 50, "unidade": "g" },
      { "nome": "azeite de dendê", "quantidade": 3, "unidade": "colheres de sopa" },
      { "nome": "cebola e gengibre ralado", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Amoleça os pães no leite de coco. Bata no liquidificador com o camarão seco, o amendoim e a castanha.",
      "Em uma panela, refogue a cebola e o gengibre no azeite de dendê.",
      "Despeje a mistura do liquidificador e cozinhe em fogo baixo, mexendo sempre, até engrossar e cozinhar bem (cerca de 20 minutos).",
      "Sirva como acompanhamento de acarajé ou com arroz branco."
    ],
    "tempo": "40 min",
    "dificuldade": "Difícil",
    "imagem_urls": [
       
      "https://i.pinimg.com/736x/1e/7f/a4/1e7fa478f361aa4c726c28f0ec8915f4.jpg",
     "https://i.ytimg.com/vi/E8kbOQe4OTs/maxresdefault.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 5400
  },
  {
    "id": "47",
    "nome": "Manjar Branco com Calda de Ameixa",
    "categoria": "Pastelaria",
    "porcoes": 8,
    "ingredientes": [
      { "nome": "leite", "quantidade": 1, "unidade": "litro" },
      { "nome": "amido de milho", "quantidade": 6, "unidade": "colheres de sopa" },
      { "nome": "leite de coco", "quantidade": 200, "unidade": "ml" },
      { "nome": "açúcar", "quantidade": 1, "unidade": "xícara" },
      { "nome": "ameixa seca sem caroço (calda)", "quantidade": 100, "unidade": "g" },
      { "nome": "água (calda)", "quantidade": 1, "unidade": "xícara" },
      { "nome": "açúcar (calda)", "quantidade": 0.5, "unidade": "xícara" }
    ],
    "preparo": [
      "Dissolva o amido de milho em um pouco de leite. Junte o restante do leite, o leite de coco e o açúcar. Leve ao fogo médio, mexendo sempre, até engrossar.",
      "Despeje em uma forma de pudim molhada com água e leve à geladeira por 4 horas.",
      "Prepare a calda: ferva a ameixa, a água e o açúcar até formar uma calda levemente espessa.",
      "Desenforme o manjar e sirva com a calda fria por cima."
    ],
    "tempo": "30 min + refrigeração",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://s2-receitas.glbimg.com/UbugegXLOeTQaP0bPBIJ-g6s13g=/0x0:2560x1707/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2024/p/R/B5GeBuTUiLMo5QJJPMIQ/manjar-branco-classico-com-calda-de-ameixa.jpg",
      "https://s2-receitas.glbimg.com/2h__-WfQJ7W1ug1KEG8YCq3VfCI=/1280x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/n/B/bPoyWeRS6jLvzWUAHeXA/manjar-branco-com-ameixas.jpg",
      "https://i.ytimg.com/vi/gcYSCrd32rE/maxresdefault.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 5500
  },
  {
    "id": "48",
    "nome": "Baião de Dois",
    "categoria": "Culinária Geral",
    "porcoes": 6,
    "ingredientes": [
      { "nome": "arroz", "quantidade": 2, "unidade": "xícaras" },
      { "nome": "feijão fradinho cozido", "quantidade": 3, "unidade": "xícaras" },
      { "nome": "carne seca ou de sol dessalgada e desfiada", "quantidade": 200, "unidade": "g" },
      { "nome": "linguiça paio em rodelas", "quantidade": 1, "unidade": "unidade" },
      { "nome": "queijo coalho em cubos", "quantidade": 200, "unidade": "g" },
      { "nome": "nata ou creme de leite", "quantidade": 100, "unidade": "g" },
      { "nome": "cebola, alho, coentro", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Frite a linguiça e a carne seca. Adicione os temperos e refogue. Junte o arroz e frite mais um pouco.",
      "Adicione água quente e cozinhe o arroz normalmente.",
      "Quando o arroz estiver quase seco, adicione o feijão cozido, o queijo coalho e a nata.",
      "Misture bem, finalize com coentro picado e sirva."
    ],
    "tempo": "40 min",
    "dificuldade": "Médio",
    "imagem_urls": [
      "https://claudia.abril.com.br/wp-content/uploads/2020/02/receita-baiao-de-dois-com-feijao-de-corda.jpg?crop=1&resize=1212,909",
      "https://sabores-new.s3.amazonaws.com/public/2024/11/baiao-de-dois-2-1024x494.jpg",
      "https://www.vivahappy.com/wp-content/uploads/2017/11/20171105_170258-480x640.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 5600
  },
  {
    "id": "49",
    "nome": "Cheesecake Romeu e Julieta",
    "categoria": "Pastelaria",
    "porcoes": 10,
    "ingredientes": [
      { "nome": "bolacha maisena triturada", "quantidade": 200, "unidade": "g" },
      { "nome": "manteiga derretida", "quantidade": 100, "unidade": "g" },
      { "nome": "cream cheese", "quantidade": 450, "unidade": "g" },
      { "nome": "leite condensado", "quantidade": 1, "unidade": "lata" },
      { "nome": "suco de limão", "quantidade": 2, "unidade": "colheres de sopa" },
      { "nome": "goiabada cremosa", "quantidade": 300, "unidade": "g" }
    ],
    "preparo": [
      "Misture a bolacha triturada com a manteiga e forre o fundo de uma forma de fundo removível. Asse por 10 minutos a 180°C. Deixe esfriar.",
      "Na batedeira, bata o cream cheese com o leite condensado e o suco de limão até ficar homogêneo.",
      "Despeje o creme sobre a base de bolacha fria e leve à geladeira por 4 horas.",
      "Derreta a goiabada com um pouco de água para amolecer, se necessário. Cubra a cheesecake com a calda de goiabada antes de servir."
    ],
    "tempo": "20 min + refrigeração",
    "dificuldade": "Fácil",
    "imagem_urls": [
      "https://dcdn-us.mitiendanube.com/stores/887/049/products/07a-torta-cheescake-romeu-e-julieta-jpg-6bb5e64a072d95f08d17338688908666-640-0.webp"
      "https://dcdn-us.mitiendanube.com/stores/887/049/products/07b-torta-cheescake-romeu-e-julieta-0ce03e6efd7a3a671a17338688906742-640-0.webp"
    ],
    "user_id": "tudogostoso_user",
    "views": 5700
  },
  {
    "id": "50",
    "nome": "Acarajé",
    "categoria": "Culinária Geral",
    "porcoes": 15,
    "ingredientes": [
      { "nome": "feijão fradinho cru", "quantidade": 500, "unidade": "g" },
      { "nome": "cebola grande picada", "quantidade": 1, "unidade": "unidade" },
      { "nome": "sal", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "azeite de dendê para fritar", "quantidade": 750, "unidade": "ml" },
      { "nome": "vatapá, caruru e vinagrete para rechear", "quantidade": 1, "unidade": "a gosto" },
      { "nome": "camarão seco para decorar", "quantidade": 1, "unidade": "a gosto" }
    ],
    "preparo": [
      "Deixe o feijão de molho de um dia para o outro. No dia seguinte, esfregue os grãos para soltar a casca e o 'olho' preto. Lave bem.",
      "Bata o feijão limpo no processador ou liquidificador com a cebola e o sal, até formar uma massa fofa e homogênea. Se necessário, adicione um mínimo de água.",
      "Bata a massa com uma colher de pau por 10 minutos para deixá-la mais aerada.",
      "Aqueça o azeite de dendê em uma panela funda. Com duas colheres, modele os bolinhos e frite em imersão até dourarem.",
      "Escorra em papel toalha. Corte ao meio e recheie com vatapá, caruru, vinagrete e camarão seco."
    ],
    "tempo": "120 min + molho",
    "dificuldade": "Difícil",
    "imagem_urls": [
      "https://guiadacozinha.com.br/wp-content/uploads/2018/04/acaraje.jpg",
      "https://turismo.b-cdn.net/wp-content/uploads/2012/11/Acaraj%C3%A9.jpg",
      "https://s2-g1.glbimg.com/iXdZdZs6Zb3aHJFSOboaxO-MIq8=/0x0:1700x1065/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/A/0/0tQYRBTDS5zzQEbmGIag/acaraje-baiano.jpg"
    ],
    "user_id": "tudogostoso_user",
    "views": 5800
  }
];

const mockProducts: Product[] = [
    { 
        id: 'p1', 
        nome: 'Espátula de Silicone', 
        categoria: 'Utensílios', 
        imagem_url: 'https://m.media-amazon.com/images/I/61xWXhPIHqL.jpg', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_oDXlxOr', 
        preco: 'R$ 59,29' 
    },
    { 
        id: 'p2', 
        nome: 'Picador de Cozinha Elétrico', 
        categoria: 'Eletrodomésticos', 
        imagem_url: 'https://ae01.alicdn.com/kf/Hcf657b31c4a74eb1845f8e05bacb0d10y.jpg', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_opNuibp', 
        preco: 'R$ 46,03' 
    },
    { 
        id: 'p3', 
        nome: 'Cesto de Silicone para Airfryer', 
        categoria: 'Utensílios', 
        imagem_url: 'https://cdn.prod.website-files.com/640b68693c13566914b5f6aa/64c3ec593a052692f168345a_gourmiaairfryer.jpg', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_oINkdnl', 
        preco: 'R$ 6,99' 
    },
    { 
        id: 'p4', 
        nome: 'Panela Elétrica Multifuncional', 
        categoria: 'Eletrodomésticos', 
        imagem_url: 'https://www.kitchenstuffplus.com/media/catalog/product/1/0/103016_hauz-rice-cooker-12-cup-white_241206143444771_b8sbwhypr68h8jjl.jpg', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_opDjlkf', 
        preco: 'R$ 234,67' 
    },
    { 
        id: 'p5', 
        nome: 'Fritadeira Elétrica (Air Fryer)', 
        categoria: 'Eletrodomésticos', 
        imagem_url: 'https://shopelitegourmet.com/cdn/shop/products/EDF2100_nobg_051322_1024x1024.jpg?v=16527274205', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_oozXHdp', 
        preco: 'R$ 239,00' 
    },
    { 
        id: 'p6', 
        nome: 'Panela de Pressão Elétrica', 
        categoria: 'Eletrodomésticos', 
        imagem_url: 'https://images.thdstatic.com/productImages/a7002343-7014-40ee-9785-9fb5fecb0370/svn/black-silver-megachef-electric-pressure-cookers-985110831m-64_1000.jpg', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_omgE3DD', 
        preco: 'R$ 399,00' 
    },
    { 
        id: 'p7', 
        nome: 'Batedeira Planetária', 
        categoria: 'Eletrodomésticos', 
        imagem_url: 'https://target.scene7.com/is/image/Target/GUEST_cc31ecae-75a2-4fe5-8153-94cd6a8108ae?wid=300&hei=300&fmt=pjpeg', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_oFVIIpl', 
        preco: 'R$ 402,77' 
    },
    { 
        id: 'p8', 
        nome: 'Multiprocessador de Alimentos', 
        categoria: 'Utensílios', 
        imagem_url: 'https://cdn.thewirecutter.com/wp-content/media/2023/10/food-processor-2048px-0077.jpg?auto=webp&quality=75&width=1024', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_oCPjut9', 
        preco: 'R$ 18,29' 
    },
    { 
        id: 'p9', 
        nome: 'Cortador de Legumes 3 em 1', 
        categoria: 'Utensílios', 
        imagem_url: 'https://m.media-amazon.com/images/I/71dipoVpbJL._UF894,1000_QL80_.jpg', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_oCuFX6x', 
        preco: 'R$ 97,49' 
    },
    { 
        id: 'p10', 
        nome: 'Garrafa de Azeite com Bico Dosador', 
        categoria: 'Utensílios', 
        imagem_url: 'http://thermos.com/cdn/shop/files/is2312gc_icon_32oz_dualtemp_glacier_2204_pres_1000px_r2.jpg?v=1695740720', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_opyimiX', 
        preco: 'R$ 6,99' 
    },
    { 
        id: 'p11', 
        nome: 'Conjunto de Utensílios de Cozinha', 
        categoria: 'Utensílios', 
        imagem_url: 'https://images.thdstatic.com/productImages/67c9e3d2-9a2e-4e5a-94fe-86d54ae7f59a/svn/stainless-steel-cooks-standard-pot-pan-sets-02659-64_1000.jpg', 
        link_afiliado: 'https://s.click.aliexpress.com/e/_on3xuTD', 
        preco: 'R$ 19,00' 
    }
];

const mockDonations: Donation[] = [
    { 
        metodo: 'Compre-me um Café', 
        descricao: 'Ama nosso trabalho? Pague-nos um café para manter a energia e a criatividade fluindo!', 
        link: 'https://buymeacoffee.com/APOIAMINHAAPP', 
        imagem_qr: 'https://picsum.photos/200/200?random=201' 
    },
    { 
        metodo: 'PayPal', 
        descricao: 'Para doações internacionais ou com cartão de crédito, use a segurança e praticidade do PayPal.', 
        link: 'https://www.paypal.com/ncp/payment/X29BVXDHT8E3J', 
        imagem_qr: 'https://picsum.photos/200/200?random=202' 
    },
    { 
        metodo: 'PIX / Airtm', 
        descricao: 'Prefere PIX? Use nosso link do Airtm para uma doação rápida, direta e sem complicações.', 
        link: 'https://airtm.me/diazenzalaurind', 
        imagem_qr: 'https://picsum.photos/200/200?random=203' 
    },
];


// --- DATA STRUCTURE FOR STORAGE ---
interface UserData {
    favorites: string[];
    scheduledRecipes: ScheduledRecipe[];
    notes: Note[];
    shoppingList: ShoppingList;
    recipes: Recipe[];
}
interface AppData {
    users: User[];
    userData: Record<string, UserData>; // Keyed by user.id
    currentUserId: string | null;
}

// --- ICONS ---
type IconName = 'heart' | 'share' | 'clock' | 'chef-hat' | 'plus' | 'edit' | 'trash' | 'arrow-left' | 'search' | 'star' | 'menu' | 'x' | 'home' | 'pot' | 'cake' | 'sparkles' | 'users' | 'chevron-left' | 'chevron-right' | 'calendar' | 'list' | 'notebook' | 'minus' | 'user' | 'logout' | 'gift' | 'email' | 'youtube' | 'instagram' | 'facebook' | 'check';

interface IconProps {
    name: IconName;
    className?: string;
}

const Icons: React.FC<IconProps> = ({ name, className = "w-6 h-6" }) => {
    const iconProps = {
        className,
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
    };

    const icons: Record<IconName, React.ReactNode> = {
        home: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" /></svg>,
        heart: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
        share: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186zm0-12.814a2.25 2.25 0 1 0 3.933-2.186 2.25 2.25 0 0 0-3.933 2.186z" /></svg>,
        clock: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
        'chef-hat': <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0-4.425 0" /></svg>,
        plus: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
        minus: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>,
        edit: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg>,
        trash: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>,
        'arrow-left': <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>,
        search: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>,
        star: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>,
        menu: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
        x: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>,
        pot: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M12 11.25v2.25m0 0A4.5 4.5 0 0 1 7.5 18H4.5a4.5 4.5 0 0 1-4.5-4.5V11.25m0 0A4.5 4.5 0 0 1 4.5 6.75h1.5a4.5 4.5 0 0 1 4.5 4.5m0 0h1.5m-1.5 0h-1.5m0 0v-2.25m0 2.25a4.5 4.5 0 0 0 4.5 4.5h3a4.5 4.5 0 0 0 4.5-4.5V11.25m0 0a4.5 4.5 0 0 0-4.5-4.5h-1.5a4.5 4.5 0 0 0-4.5 4.5m0 0h-1.5m6-4.5v-1.5a1.5 1.5 0 0 0-1.5-1.5h-1.5a1.5 1.5 0 0 0-1.5 1.5v1.5" /></svg>,
        cake: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25c0-2.33-1.44-4.32-3.5-5.26M18.75 11.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM12 11.25c0-2.33-1.44-4.32-3.5-5.26M9.75 11.25a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c-3.13 0-6-1.8-6-4.5v-3.75c0-2.33 1.44-4.32 3.5-5.26 2.06-.94 4.94-.94 7 0 2.06.94 3.5 2.93 3.5 5.26v3.75c0 2.7-2.87 4.5-6 4.5Z" /></svg>,
        sparkles: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>,
        users: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-2.453M15 19.128v-3.873M15 19.128A9.37 9.37 0 0 1 12 21a9.37 9.37 0 0 1-3-5.872M15 19.128a9.37 9.37 0 0 0-3-5.872m0 0a9.37 9.37 0 0 0-3 5.872m-3 5.872A9.37 9.37 0 0 1 6 21a9.37 9.37 0 0 1-3-5.872M6 15.128v-3.873m0 0a9.37 9.37 0 0 1 3-5.872m0 0a9.37 9.37 0 0 1 3 5.872m0 0A9.37 9.37 0 0 1 12 21" /></svg>,
        'chevron-left': <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>,
        'chevron-right': <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>,
        calendar: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0H18" /></svg>,
        list: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" /></svg>,
        notebook: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125M12 15v5.25a.75.75 0 0 1-.75.75H3a.75.75 0 0 1-.75-.75V8.25a.75.75 0 0 1 .75-.75h5.25" /></svg>,
        user: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
        logout: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0-3-3m0 0 3-3m-3 3H9" /></svg>,
        gift: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>,
        email: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" /></svg>,
        youtube: <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/></svg>,
        instagram: <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644.07 4.85.07m0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073h.001zM12 6.848c-2.839 0-5.152 2.313-5.152 5.152s2.313 5.152 5.152 5.152 5.152-2.313 5.152-5.152-2.313-5.152-5.152-5.152zm0 8.318c-1.741 0-3.152-1.411-3.152-3.152s1.411-3.152 3.152-3.152 3.152 1.411 3.152 3.152-1.411 3.152-3.152-3.152zm4.908-6.428c-.792 0-1.438.646-1.438 1.438s.646 1.438 1.438 1.438 1.438-.646 1.438-1.438-.646-1.438-1.438-1.438z"/></svg>,
        facebook: <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className}><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>,
        check: <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>,
    };
    return icons[name] || null;
};

// --- CONTEXT ---
interface AppContextType {
    // Auth
    currentUser: User | null;
    users: User[];
    login: (userId: string) => void;
    logout: () => void;
    createUser: (name: string) => void;
    // Data
    recipes: Recipe[];
    products: Product[];
    donations: Donation[];
    favorites: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
    scheduledRecipes: ScheduledRecipe[];
    scheduleRecipe: (recipeId: string, date: string) => void;
    notes: Note[];
    saveNote: (noteData: { id?: string; title: string; content: string; }) => void;
    deleteNote: (id: string) => void;
    shoppingList: ShoppingList;
    updateShoppingList: (list: ShoppingList) => void;
    saveRecipe: (recipeData: Omit<Recipe, 'id' | 'user_id' | 'views'| 'imagem_urls'> & { id?: string }) => string | undefined;
    deleteRecipe: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);
const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within an AppProvider');
    return context;
};
const useFavorites = useAppContext; // Alias for legacy components


// --- REUSABLE COMPONENTS ---

interface HeaderProps {
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen }) => {
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
      `block py-2 px-3 rounded-lg text-base font-medium transition-colors duration-300 ${isActive ? 'text-teal bg-teal/10' : 'text-brand-text-primary hover:text-teal hover:bg-teal/10'}`;

    const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
      `block w-full text-left p-4 rounded-lg text-lg transition-all duration-300 ${isActive ? 'bg-teal text-white font-bold shadow-lg' : 'text-slate-800 bg-white shadow-sm hover:bg-slate-100 hover:shadow-md'}`;

    return (
        <>
            <header className="bg-brand-surface/80 backdrop-blur-sm sticky top-0 z-40 border-b border-slate-200/80">
                <nav className="container mx-auto px-6 py-3">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="text-2xl md:text-3xl font-bold text-teal">
                            Receitas com Charme
                        </Link>
                        <div className="hidden md:flex items-center space-x-2">
                            <NavLink to="/receitas" className={navLinkClass}>Receitas</NavLink>
                            <NavLink to="/perfil" className={navLinkClass}>Perfil</NavLink>
                            <NavLink to="/sugestao-do-dia" className={navLinkClass}>Sugestão</NavLink>
                            <NavLink to="/loja" className={navLinkClass}>Loja</NavLink>
                            <NavLink to="/sobre" className={navLinkClass}>Sobre</NavLink>
                            <Link to="/doacoes" className="flex items-center gap-1.5 bg-soft-green text-white font-bold py-2 px-4 rounded-full hover:bg-soft-green/90 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 ml-4">
                                <Icons name="heart" className="w-5 h-5" />
                                <span>Apoiar</span>
                            </Link>
                        </div>
                        <button className="md:hidden" onClick={() => setIsMenuOpen(true)}>
                            <Icons name="menu" className="w-8 h-8 text-teal" />
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu */}
             <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 md:hidden"
                    >
                        <div onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-black/40"></div>
                        <motion.aside 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="absolute top-0 right-0 h-full w-4/5 max-w-sm bg-brand-background shadow-xl flex flex-col"
                        >
                            <div className="p-4 flex justify-end">
                                <button onClick={() => setIsMenuOpen(false)}>
                                    <Icons name="x" className="w-8 h-8 text-teal" />
                                </button>
                            </div>
                            <nav className="px-4 space-y-4">
                                <NavLink to="/receitas" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Receitas</NavLink>
                                <NavLink to="/perfil" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Perfil</NavLink>
                                <NavLink to="/sugestao-do-dia" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Sugestão do Dia</NavLink>
                                <NavLink to="/favoritas" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Favoritas</NavLink>
                                <NavLink to="/loja" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Loja</NavLink>
                                <NavLink to="/sobre" className={mobileNavLinkClass} onClick={() => setIsMenuOpen(false)}>Sobre</NavLink>
                            </nav>
                            <div className="px-4 py-6 mt-auto">
                                <Link to="/doacoes" className="block w-full text-center p-4 rounded-xl text-lg bg-gradient-to-r from-soft-green to-teal text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
                                    <Icons name="heart" className="w-6 h-6" />
                                    <span>Apoie o Projeto</span>
                                </Link>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
             </AnimatePresence>
        </>
    );
};

const BottomNav: React.FC = () => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center text-center w-full transition-all duration-300 ${isActive ? 'text-teal' : 'text-slate-500 hover:text-teal'}`;

    return (
        <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl z-30 h-16">
            <div className="flex justify-around h-full items-center">
                <NavLink to="/" className={navLinkClass} end>
                    <Icons name="home" className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Início</span>
                </NavLink>
                <NavLink to="/receitas" className={navLinkClass}>
                    <Icons name="pot" className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Receitas</span>
                </NavLink>
                <Link to="/adicionar-receita" className="flex items-center justify-center -mt-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-teal rounded-full shadow-lg text-white hover:bg-teal/90 transform hover:scale-105 transition-all duration-300">
                        <Icons name="plus" className="w-8 h-8" />
                    </div>
                </Link>
                <NavLink to="/favoritas" className={navLinkClass}>
                    <Icons name="heart" className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Favoritos</span>
                </NavLink>
                <NavLink to="/perfil" className={navLinkClass}>
                    <Icons name="chef-hat" className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold">Perfil</span>
                </NavLink>
            </div>
        </nav>
    );
};

const Footer: React.FC = () => (
    <footer className="bg-slate-800 text-slate-300 mt-16">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <div>
                <h3 className="text-2xl font-bold text-teal">Receitas com Charme</h3>
                <p className="max-w-md mt-2 text-slate-400">Culinária prática e elegante para o seu dia a dia.</p>
                <div className="mt-4">
                    <Link to="/doacoes" className="bg-soft-green text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg">
                        💛 Apoie o Projeto
                    </Link>
                </div>
            </div>
            <div className="mt-8 md:mt-0">
                <h4 className="font-bold text-lg mb-2 text-white">Siga-nos</h4>
                <div className="flex justify-center md:justify-start space-x-4">
                    <a href="https://www.youtube.com/@lojafacilon" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-soft-green">YouTube</a>
                    <a href="https://www.instagram.com/lojafacilon" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-soft-green">Instagram</a>
                    <a href="https://www.facebook.com/lojafacilon/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-soft-green">Facebook</a>
                    <a href="mailto:receitascomcharme@gmail.com" className="text-slate-400 hover:text-soft-green">Email</a>
                </div>
            </div>
        </div>
        <div className="bg-black/20 py-4">
            <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Receitas com Charme. Todos os direitos reservados.</p>
                 <div className="text-xs mt-2">
                    <p>
                        Imagem da pág. "Sobre" por <a href="https://unsplash.com/@brookelark" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">Brooke Lark</a>.
                        Imagem da pág. "Apoiar" por <a href="https://unsplash.com/@austindistel" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">Austin Distel</a>.
                        Ambas via <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">Unsplash</a>.
                    </p>
                </div>
            </div>
        </div>
    </footer>
);

interface RecipeCardProps {
    recipe: Recipe;
}
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const isFav = isFavorite(recipe.id);

    return (
        <div className="bg-brand-surface rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
             <div className="relative">
                 <Link to={`/receita/${recipe.id}`}>
                    <img src={recipe.imagem_urls[0]} alt={recipe.nome} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                 </Link>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(recipe.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200"
                    aria-label={isFav ? "Desfavoritar" : "Favoritar"}
                >
                    <motion.div
                        animate={{ scale: isFav ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Icons name="heart" className={`w-6 h-6 ${isFav ? 'text-red-500 fill-current' : 'text-slate-400'}`} />
                    </motion.div>
                </motion.button>
             </div>
            <div className="p-4">
                <span className="text-xs font-bold text-teal uppercase">{recipe.categoria}</span>
                <h3 className="text-lg font-bold text-brand-text-primary group-hover:text-teal transition-colors duration-300 mt-1 h-14">{recipe.nome}</h3>
                <div className="flex items-center text-slate-500 text-sm mt-2 space-x-2">
                    <div className="flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        <Icons name="clock" className="w-4 h-4 mr-1.5" />
                        <span>{recipe.tempo}</span>
                    </div>
                    <div className="flex items-center text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        <Icons name="chef-hat" className="w-4 h-4 mr-1.5" />
                        <span>{recipe.dificuldade}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ProductCardProps {
    product: Product;
}
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <a href={product.link_afiliado} target="_blank" rel="noopener noreferrer" className="bg-brand-surface rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col">
            <div className="relative">
                <img src={product.imagem_url} alt={product.nome} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                 <span className="text-xs font-bold text-teal uppercase">{product.categoria}</span>
                <h3 className="text-lg font-bold text-brand-text-primary group-hover:text-teal transition-colors duration-300 mt-1 flex-1">{product.nome}</h3>
                {product.preco && (
                    <p className="text-lg font-bold text-soft-green mt-2">{product.preco}</p>
                )}
                <div className="mt-4">
                    <span className="w-full block text-center bg-teal text-white font-bold py-2 px-4 rounded-full hover:bg-teal/90 transition-all duration-300 shadow-sm group-hover:shadow-md">
                        Ver na Loja
                    </span>
                </div>
            </div>
        </a>
    );
};

const BackButton: React.FC<{ className?: string }> = ({ className = '' }) => {
    const navigate = useNavigate();
    return (
        <button onClick={() => navigate(-1)} className={`inline-flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors group ${className}`}>
            <Icons name="arrow-left" className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-semibold">Voltar</span>
        </button>
    );
};

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex items-center justify-center gap-4 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand-text-secondary bg-brand-surface rounded-lg shadow-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                <Icons name="chevron-left" className="w-4 h-4" />
                Anterior
            </button>
            <span className="text-sm font-bold text-brand-text-primary">
                Página {currentPage} de {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-brand-text-secondary bg-brand-surface rounded-lg shadow-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
                Próxima
                <Icons name="chevron-right" className="w-4 h-4" />
            </button>
        </div>
    );
};

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -20,
    },
};

const pageTransition: Transition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
};

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
        {children}
    </motion.div>
);


// --- PAGES ---

const carouselImages = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop',
];

const HomePage: React.FC = () => {
    const { recipes, products } = useAppContext();
    const randomRecipes = useMemo(() => [...recipes].sort(() => 0.5 - Math.random()).slice(0, 5), [recipes]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % carouselImages.length);
        }, 5000); // Change image every 5 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center text-center text-white bg-slate-900 overflow-hidden p-4">
                <AnimatePresence>
                {carouselImages.map((src, index) => (
                    index === currentImageIndex &&
                    <motion.div 
                        key={src}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                         <img
                            src={src}
                            alt="Banquete elegante"
                            className="w-full h-full object-cover"
                        />
                         <div className="absolute inset-0 bg-black/40"></div>
                    </motion.div>
                ))}
                </AnimatePresence>
                <div className="relative z-10 p-8 animate-fade-in">
                    <h1 className="text-5xl md:text-7xl font-bold text-white [text-shadow:_2px_2px_8px_rgb(0_0_0_/_50%)]">Sabor que Inspira</h1>
                    <p className="mt-4 text-xl max-w-2xl mx-auto text-slate-200 [text-shadow:_1px_1px_4px_rgb(0_0_0_/_50%)]">Descubra receitas e transforme sua cozinha.</p>
                    <Link to="/receitas" className="mt-8 inline-block bg-teal text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-teal/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        Explorar Receitas
                    </Link>
                </div>
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
                    {carouselImages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'}`}
                        />
                    ))}
                </div>
            </section>

            {/* Quick Access Buttons */}
            <section className="container mx-auto px-6">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
                    <Link to="/receitas?categoria=Culinária Geral" className="group p-6 bg-brand-surface rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center">
                        <Icons name="pot" className="w-10 h-10 mb-2 text-teal"/>
                        <h3 className="text-lg font-bold text-brand-text-primary">Culinária Geral</h3>
                    </Link>
                    <Link to="/receitas?categoria=Pastelaria" className="group p-6 bg-brand-surface rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center">
                        <Icons name="cake" className="w-10 h-10 mb-2 text-teal"/>
                        <h3 className="text-lg font-bold text-brand-text-primary">Pastelaria</h3>
                    </Link>
                     <Link to="/minhas-receitas" className="group p-6 bg-brand-surface rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center">
                         <Icons name="chef-hat" className="w-10 h-10 mb-2 text-teal"/>
                        <h3 className="text-lg font-bold text-brand-text-primary">Minhas Receitas</h3>
                    </Link>
                    <Link to="/favoritas" className="group p-6 bg-brand-surface rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center">
                        <Icons name="heart" className="w-10 h-10 mb-2 text-teal"/>
                        <h3 className="text-lg font-bold text-brand-text-primary">Favoritas</h3>
                    </Link>
                </div>
            </section>

            {/* Random Recipes Carousel */}
            <section className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center mb-8 text-brand-text-primary">Destaques da Semana</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {randomRecipes.slice(0,3).map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                </div>
            </section>
            
            {/* Affiliate Products */}
            <section className="bg-brand-surface py-16">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-brand-text-primary">Utensílios que Amamos</h2>
                        <p className="mt-2 text-brand-text-secondary">Selecionamos os melhores produtos para facilitar sua vida na cozinha.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {products.slice(0, 8).map(product => (
                            <a href={product.link_afiliado} key={product.id} target="_blank" rel="noopener noreferrer" className="text-center group">
                                <div className="bg-slate-100 rounded-2xl p-4 aspect-square flex items-center justify-center overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                                    <img src={product.imagem_url} alt={product.nome} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"/>
                                </div>
                                <h4 className="mt-4 font-bold text-brand-text-primary">{product.nome}</h4>
                                <p className="text-sm text-soft-green font-bold">{product.preco}</p>
                            </a>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                         <Link to="/loja" className="inline-block bg-teal text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-teal/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                            Ver todos os produtos
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call to Action - Donation */}
            <section className="container mx-auto px-6">
                <div className="bg-gradient-to-br from-soft-green to-teal text-white rounded-2xl p-8 md:p-12 text-center shadow-xl flex flex-col items-center">
                    <h2 className="text-4xl font-bold text-white [text-shadow:_1px_1px_2px_rgb(0_0_0_/_30%)] mb-4">Apoie o nosso projeto!</h2>
                    <p className="max-w-2xl mx-auto text-slate-100 mb-8">
                        Sua contribuição é o ingrediente secreto que nos ajuda a continuar criando e compartilhando receitas incríveis com toda a comunidade.
                    </p>
                    <Link to="/doacoes" className="inline-block bg-white text-teal font-bold py-3 px-8 rounded-full text-lg hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        💛 Fazer uma Doação
                    </Link>
                </div>
            </section>
        </div>
    );
};

const RecipesPage: React.FC = () => {
    const { recipes } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ categoria: 'Todos', dificuldade: 'Todos', tempo: 'Todos' });
    const [currentPage, setCurrentPage] = useState(1);
    const RECIPES_PER_PAGE = 12;
    
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const categoria = params.get('categoria');
        if (categoria) {
            setFilters(f => ({ ...f, categoria }));
        }
    }, [location.search]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const parseTimeToMinutes = (timeString: string): number => {
        if (!timeString) return 0;
        let totalMinutes = 0;
        
        const hoursMatch = timeString.match(/(\d+)\s*h/);
        if (hoursMatch) {
            totalMinutes += parseInt(hoursMatch[1], 10) * 60;
        }
        
        const minutesMatch = timeString.match(/(\d+)\s*min/);
        if (minutesMatch) {
            totalMinutes += parseInt(minutesMatch[1], 10);
        }
        
        if (totalMinutes === 0) {
            const fallbackMatch = timeString.match(/\d+/);
            if (fallbackMatch) {
                totalMinutes = parseInt(fallbackMatch[0], 10);
            }
        }
        
        return totalMinutes;
    };

    const filteredRecipes = useMemo(() => {
        return recipes.filter(recipe => {
            const matchesSearch = recipe.nome.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filters.categoria === 'Todos' || recipe.categoria === filters.categoria;
            const matchesDifficulty = filters.dificuldade === 'Todos' || recipe.dificuldade === filters.dificuldade;
            
            const timeInMin = parseTimeToMinutes(recipe.tempo);
            const matchesTime = filters.tempo === 'Todos' || 
                (filters.tempo === 'Rápido' && timeInMin > 0 && timeInMin <= 30) || 
                (filters.tempo === 'Médio' && timeInMin > 30 && timeInMin <= 60) || 
                (filters.tempo === 'Longo' && timeInMin > 60);

            return matchesSearch && matchesCategory && matchesDifficulty && matchesTime;
        });
    }, [recipes, searchTerm, filters]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
    const currentRecipes = filteredRecipes.slice(
        (currentPage - 1) * RECIPES_PER_PAGE,
        currentPage * RECIPES_PER_PAGE
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton className="mb-4" />
            <h1 className="text-4xl font-bold text-center mb-8 text-brand-text-primary">Nossas Receitas</h1>
            {/* Filters */}
            <div className="bg-brand-surface p-4 rounded-2xl shadow-lg mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="w-full">
                    <label htmlFor="search" className="block text-sm font-bold text-brand-text-primary mb-1">Buscar por nome</label>
                    <div className="relative">
                        <input
                            type="text"
                            id="search"
                            placeholder="Ex: Bolo de Chocolate"
                            className="w-full p-2 border border-slate-300 rounded-lg pl-10 focus:ring-2 focus:ring-teal/50 focus:border-teal/80 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Icons name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    </div>
                </div>
                <div>
                    <label htmlFor="categoria" className="block text-sm font-bold text-brand-text-primary mb-1">Categoria</label>
                    <select name="categoria" id="categoria" value={filters.categoria} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal/50 focus:border-teal/80 transition">
                        <option>Todos</option>
                        <option>Culinária Geral</option>
                        <option>Pastelaria</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="dificuldade" className="block text-sm font-bold text-brand-text-primary mb-1">Dificuldade</label>
                    <select name="dificuldade" id="dificuldade" value={filters.dificuldade} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal/50 focus:border-teal/80 transition">
                        <option>Todos</option>
                        <option>Fácil</option>
                        <option>Médio</option>
                        <option>Difícil</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="tempo" className="block text-sm font-bold text-brand-text-primary mb-1">Tempo de Preparo</label>
                    <select name="tempo" id="tempo" value={filters.tempo} onChange={handleFilterChange} className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal/50 focus:border-teal/80 transition">
                        <option>Todos</option>
                        <option>Rápido</option>
                        <option>Médio</option>
                        <option>Longo</option>
                    </select>
                </div>
            </div>

            {/* Recipe List */}
            {currentRecipes.length > 0 ? (
                 <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                    </div>
                    {totalPages > 1 && (
                       <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    )}
                 </>
            ) : (
                <p className="text-center text-brand-text-secondary mt-12">Nenhuma receita encontrada com os filtros selecionados.</p>
            )}
        </div>
    );
};

const RecipeDetailPage: React.FC = () => {
    const { recipes, products } = useAppContext();
    const { id } = useParams();
    const navigate = useNavigate();
    const recipe = recipes.find(r => r.id === id);
    const { isFavorite, toggleFavorite } = useFavorites();
    
    const [mainImage, setMainImage] = useState(recipe?.imagem_urls[0]);
    const [servings, setServings] = useState(recipe?.porcoes || 1);
    const [isCookingMode, setIsCookingMode] = useState(false);
    const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
    const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

    useEffect(() => {
        window.scrollTo(0, 0);
        if (recipe) {
            setMainImage(recipe.imagem_urls[0]);
            setServings(recipe.porcoes);
            setIsCookingMode(false);
            setCheckedIngredients(new Set());
            setCheckedSteps(new Set());
        }
    }, [recipe]);

    if (!recipe) return <div className="text-center py-12">Receita não encontrada.</div>;

    const handleShare = async () => {
        const shareData = {
            title: `Receita: ${recipe.nome}`,
            text: `Confira esta deliciosa receita de ${recipe.nome} que encontrei no Receitas com Charme!`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Compartilhamento cancelado pelo usuário', err);
            }
        } else {
            // Fallback for browsers that don't support navigator.share
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link da receita copiado para a área de transferência!');
            } catch (err) {
                console.error('Falha ao copiar o link: ', err);
                alert('Não foi possível copiar o link. Por favor, copie manualmente a URL da barra de endereço.');
            }
        }
    };

    const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
        if (!url) return null;
        let videoId;
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname === 'youtu.be') {
                videoId = urlObj.pathname.slice(1);
            } else {
                videoId = urlObj.searchParams.get('v');
            }
        } catch (e) {
             const parts = url.split('/');
             videoId = parts[parts.length -1];
        }
        if (videoId) {
            return `https://www.youtube.com/embed/${videoId.split('?')[0]}`;
        }
        return null;
    };

    const servingsRatio = servings / recipe.porcoes;

    const toggleIngredient = (index: number) => {
        setCheckedIngredients(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const toggleStep = (index: number) => {
        setCheckedSteps(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const embedUrl = getYouTubeEmbedUrl(recipe.video_url);

    return (
        <div className="relative">
            <div className="lg:container lg:mx-auto lg:px-6 lg:py-8">
                <div className="bg-brand-surface lg:rounded-2xl lg:shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-5">
                        <div className="lg:col-span-3">
                             <div className="relative">
                                <img src={mainImage} alt={recipe.nome} className="w-full h-80 lg:h-auto lg:aspect-[4/3] object-cover" />
                                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-20 flex items-center justify-center w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
                                    <Icons name="arrow-left" className="w-6 h-6 text-brand-text-primary" />
                                </button>
                             </div>
                            {recipe.imagem_urls.length > 1 && (
                                <div className="grid grid-cols-5 gap-2 p-2">
                                    {recipe.imagem_urls.map((url, index) => (
                                        <img key={index} src={url} alt={`Imagem ${index+1}`} onClick={() => setMainImage(url)} className={`w-full rounded-md cursor-pointer aspect-square object-cover border-4 transition-all ${mainImage === url ? 'border-teal' : 'border-transparent hover:border-teal/50'}`} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-2 p-6">
                            <header className="mb-6 border-b pb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="font-bold text-teal">{recipe.categoria}</span>
                                        <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary mt-2">{recipe.nome}</h1>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => toggleFavorite(recipe.id)} className="p-2 rounded-full hover:bg-red-100"><Icons name="heart" className={`w-7 h-7 ${isFavorite(recipe.id) ? 'text-red-500 fill-current' : 'text-slate-400'}`} /></button>
                                        <button onClick={handleShare} className="p-2 rounded-full hover:bg-slate-200"><Icons name="share" className="w-7 h-7 text-slate-500" /></button>
                                    </div>
                                </div>
                                <div className="flex items-center text-brand-text-secondary text-md mt-4 space-x-6">
                                    <div className="flex items-center"><Icons name="clock" className="w-5 h-5 mr-2 text-soft-green" /><span>{recipe.tempo}</span></div>
                                    <div className="flex items-center"><Icons name="chef-hat" className="w-5 h-5 mr-2 text-soft-green" /><span>{recipe.dificuldade}</span></div>
                                    <div className="flex items-center"><Icons name="users" className="w-5 h-5 mr-2 text-soft-green" /><span>{recipe.porcoes} porções</span></div>
                                </div>
                            </header>

                            <div className="space-y-8">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-2xl font-bold text-brand-text-primary">Ingredientes</h2>
                                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full">
                                            <button onClick={() => setServings(s => Math.max(1, s - 1))} className="p-1.5 rounded-full bg-white shadow"><Icons name="minus" className="w-4 h-4 text-slate-600" /></button>
                                            <span className="font-bold text-slate-700 w-20 text-center">{servings} {servings > 1 ? "porções" : "porção"}</span>
                                            <button onClick={() => setServings(s => s + 1)} className="p-1.5 rounded-full bg-white shadow"><Icons name="plus" className="w-4 h-4 text-slate-600" /></button>
                                        </div>
                                    </div>
                                    <ul className="space-y-3 text-brand-text-primary">
                                        {recipe.ingredientes.map((ing, i) => (
                                            <li key={i} onClick={() => isCookingMode && toggleIngredient(i)} className={`transition-all duration-300 ${isCookingMode ? 'flex items-center gap-3 p-2 bg-slate-50 rounded-lg cursor-pointer' : 'pl-2'} ${checkedIngredients.has(i) ? 'opacity-40' : ''}`}>
                                                {isCookingMode && (
                                                    <div className={`w-6 h-6 rounded-md border-2 flex-shrink-0 transition-all ${checkedIngredients.has(i) ? 'bg-soft-green border-soft-green' : 'border-slate-300 bg-white'}`}>
                                                        {checkedIngredients.has(i) && <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                )}
                                                <span className={`${checkedIngredients.has(i) ? 'line-through' : ''} ${!isCookingMode ? 'before:content-["•"] before:mr-2 before:text-teal' : ''}`}>
                                                    {ing.quantidade > 0 && <strong>{(ing.quantidade * servingsRatio).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} {ing.unidade}</strong>} {ing.unidade !== 'a gosto' && ing.unidade && ' de '} {ing.nome}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Modo de Preparo</h2>
                                    <ol className="space-y-4 text-brand-text-primary leading-relaxed">
                                        {recipe.preparo.map((step, i) => (
                                            <li key={i} onClick={() => isCookingMode && toggleStep(i)} className={`transition-all duration-300 flex items-start gap-3 ${isCookingMode ? 'p-3 bg-slate-50 rounded-lg cursor-pointer' : ''} ${checkedSteps.has(i) ? 'opacity-40' : ''}`}>
                                                <div className={`font-bold text-teal mt-1 flex-shrink-0 ${checkedSteps.has(i) ? 'line-through' : ''}`}>{i + 1}.</div>
                                                <span className={`${checkedSteps.has(i) ? 'line-through' : ''}`}>{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                                <div className="my-8">
                                    <div className="bg-gradient-to-r from-teal/10 to-soft-green/10 p-6 rounded-2xl text-center">
                                        <h3 className="text-2xl font-bold text-brand-text-primary">Gostou desta receita?</h3>
                                        <p className="mt-2 text-brand-text-secondary">Seu apoio nos ajuda a criar mais conteúdo delicioso como este. Considere fazer uma doação!</p>
                                        <Link to="/doacoes" className="mt-4 inline-block bg-teal text-white font-bold py-2 px-6 rounded-full hover:bg-teal/90 transition-all duration-300 shadow-md hover:shadow-lg">
                                            💛 Apoiar o Projeto
                                        </Link>
                                    </div>
                                </div>
                                {embedUrl && (
                                    <div className="pt-4">
                                        <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Vídeo Tutorial</h2>
                                        <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                                            <iframe src={embedUrl} title={recipe.nome} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full"></iframe>
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-col gap-4 pt-4">
                                    <button onClick={() => setIsCookingMode(!isCookingMode)} className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg ${isCookingMode ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                        <Icons name="pot" className="w-5 h-5"/>
                                        <span>{isCookingMode ? 'Sair do Modo de Cozinha' : 'Cozinhar Passo a Passo'}</span>
                                    </button>
                                     <Link to={`/programar/${recipe.id}`} className="w-full flex items-center justify-center gap-2 bg-soft-green text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg">
                                        <Icons name="calendar" className="w-5 h-5"/>
                                        <span>Programar Cozinha</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 p-6 border-t border-slate-200">
                        <h2 className="text-2xl font-bold text-brand-text-primary mb-6">Utensílios Sugeridos</h2>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {products.slice(0, 4).map(product => (
                                <a href={product.link_afiliado} key={product.id} target="_blank" rel="noopener noreferrer" className="text-center group">
                                    <div className="bg-slate-100 rounded-lg p-4 aspect-square flex items-center justify-center overflow-hidden">
                                         <img src={product.imagem_url} alt={product.nome} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300"/>
                                    </div>
                                    <h4 className="mt-2 font-bold text-sm text-brand-text-primary">{product.nome}</h4>
                                    <p className="text-xs text-teal group-hover:underline">Ver produto</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfilePage: React.FC = () => {
    const { currentUser, logout } = useAppContext();

    const menuItems = [
        { name: 'Minhas Receitas', icon: 'chef-hat', path: '/minhas-receitas', color: 'text-teal' },
        { name: 'Minha Agenda', icon: 'calendar', path: '/agenda', color: 'text-soft-green' },
        { name: 'Lista de Compras', icon: 'list', path: '/lista-de-compras', color: 'text-light-green' },
        { name: 'Bloco de Notas', icon: 'notebook', path: '/bloco-de-notas', color: 'text-slate-600' },
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <BackButton className="mb-4" />
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-brand-text-primary">Meu Perfil</h1>
                <p className="text-xl text-brand-text-secondary mt-2">Olá, <span className="font-bold">{currentUser?.name}</span>!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {menuItems.map(item => (
                    <Link key={item.path} to={item.path} className="group flex items-center gap-4 p-6 bg-brand-surface rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className={`p-3 bg-slate-100 rounded-full`}>
                             <Icons name={item.icon as IconName} className={`w-8 h-8 ${item.color} transition-colors`} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-brand-text-primary">{item.name}</h2>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="mt-8 text-center">
                 <button onClick={logout} className="flex items-center justify-center gap-2 mx-auto bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-full hover:bg-slate-300 transition-all duration-300">
                    <Icons name="logout" className="w-5 h-5"/>
                    <span>Trocar de Perfil</span>
                </button>
            </div>
        </div>
    );
};


const MyRecipesPage: React.FC = () => {
    const { recipes, currentUser, deleteRecipe } = useAppContext();
    const myRecipes = recipes.filter(r => r.user_id === currentUser?.id);

    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton className="mb-4" />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-brand-text-primary">Minhas Receitas ({myRecipes.length})</h1>
                <Link to="/adicionar-receita" className="hidden md:flex items-center gap-2 bg-teal text-white font-bold py-2 px-4 rounded-full hover:bg-teal/90 transition-all duration-300 shadow-md hover:shadow-lg">
                    <Icons name="plus" className="w-5 h-5"/>
                    <span>Adicionar</span>
                </Link>
            </div>
            {myRecipes.length > 0 ? (
                <div className="space-y-4">
                    {myRecipes.map(recipe => (
                        <div key={recipe.id} className="bg-brand-surface p-4 rounded-2xl shadow-lg flex items-center justify-between">
                            <Link to={`/receita/${recipe.id}`} className="flex items-center gap-4 flex-grow">
                                <img src={recipe.imagem_urls[0]} alt={recipe.nome} className="w-20 h-20 object-cover rounded-lg" />
                                <div>
                                    <h3 className="text-lg font-bold text-brand-text-primary">{recipe.nome}</h3>
                                    <p className="text-sm text-brand-text-secondary">{recipe.categoria}</p>
                                </div>
                            </Link>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Link to={`/editar-receita/${recipe.id}`} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                                    <Icons name="edit" className="w-5 h-5 text-slate-600" />
                                </Link>
                                <button onClick={() => window.confirm('Tem certeza que deseja excluir esta receita?') && deleteRecipe(recipe.id)} className="p-2 rounded-full hover:bg-red-100 transition-colors">
                                    <Icons name="trash" className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-brand-surface rounded-2xl shadow-lg">
                    <p className="text-brand-text-secondary">Você ainda não criou nenhuma receita.</p>
                    <Link to="/adicionar-receita" className="mt-4 inline-block bg-teal text-white font-bold py-3 px-6 rounded-full hover:bg-teal/90 transition-all duration-300 shadow-md hover:shadow-lg">
                        Criar minha primeira receita
                    </Link>
                </div>
            )}
        </div>
    );
};

const RecipeFormPage: React.FC<{
    initialData?: Recipe;
    pageTitle: string;
    buttonText: string;
}> = ({ initialData, pageTitle, buttonText }) => {
    const { saveRecipe } = useAppContext();
    const navigate = useNavigate();
    const [recipeData, setRecipeData] = useState({
        nome: initialData?.nome || '',
        categoria: initialData?.categoria || 'Culinária Geral',
        ingredientes: initialData?.ingredientes || [{ nome: '', quantidade: 0, unidade: '' }],
        preparo: initialData?.preparo?.join('\n') || '',
        tempo: initialData?.tempo || '',
        porcoes: initialData?.porcoes || 4,
        dificuldade: initialData?.dificuldade || 'Fácil',
        video_url: initialData?.video_url || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRecipeData(prev => ({ ...prev, [name]: name === 'porcoes' ? parseInt(value) : value }));
    };

    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
        const newIngredients = [...recipeData.ingredientes];
        (newIngredients[index] as any)[field] = value;
        setRecipeData(prev => ({ ...prev, ingredientes: newIngredients }));
    };

    const addIngredient = () => {
        setRecipeData(prev => ({...prev, ingredientes: [...prev.ingredientes, { nome: '', quantidade: 0, unidade: '' }]}));
    };
    
    const removeIngredient = (index: number) => {
        setRecipeData(prev => ({...prev, ingredientes: prev.ingredientes.filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...recipeData,
            preparo: recipeData.preparo.split('\n').filter(line => line.trim() !== ''),
        };
        saveRecipe({ id: initialData?.id, ...finalData });
        navigate(initialData?.id ? `/receita/${initialData.id}` : '/minhas-receitas');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <BackButton className="mb-4" />
            <h1 className="text-4xl font-bold text-center mb-8 text-brand-text-primary">{pageTitle}</h1>
            <form onSubmit={handleSubmit} className="bg-brand-surface p-6 rounded-2xl shadow-lg space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-bold text-brand-text-primary mb-1">Nome da Receita</label>
                        <input type="text" name="nome" value={recipeData.nome} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
                    </div>
                    <div>
                        <label htmlFor="categoria" className="block text-sm font-bold text-brand-text-primary mb-1">Categoria</label>
                        <select name="categoria" value={recipeData.categoria} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                            <option>Culinária Geral</option>
                            <option>Pastelaria</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tempo" className="block text-sm font-bold text-brand-text-primary mb-1">Tempo de Preparo</label>
                        <input type="text" name="tempo" value={recipeData.tempo} onChange={handleChange} placeholder="Ex: 45 min" className="w-full p-3 border border-slate-300 rounded-lg" required />
                    </div>
                    <div>
                        <label htmlFor="dificuldade" className="block text-sm font-bold text-brand-text-primary mb-1">Dificuldade</label>
                        <select name="dificuldade" value={recipeData.dificuldade} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg">
                            <option>Fácil</option>
                            <option>Médio</option>
                            <option>Difícil</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="porcoes" className="block text-sm font-bold text-brand-text-primary mb-1">Porções</label>
                        <input type="number" name="porcoes" value={recipeData.porcoes} onChange={handleChange} className="w-full p-3 border border-slate-300 rounded-lg" required min="1" />
                    </div>
                    <div>
                        <label htmlFor="video_url" className="block text-sm font-bold text-brand-text-primary mb-1">URL do Vídeo (YouTube)</label>
                        <input type="text" name="video_url" value={recipeData.video_url} onChange={handleChange} placeholder="https://www.youtube.com/watch?v=..." className="w-full p-3 border border-slate-300 rounded-lg"/>
                    </div>
                </div>

                {/* Ingredients */}
                <div>
                    <h2 className="text-xl font-bold text-brand-text-primary mb-2">Ingredientes</h2>
                    <div className="space-y-2">
                        {recipeData.ingredientes.map((ing, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <input type="number" placeholder="Qtd" value={ing.quantidade} onChange={e => handleIngredientChange(index, 'quantidade', parseFloat(e.target.value))} className="col-span-2 p-3 border border-slate-300 rounded-lg" />
                                <input type="text" placeholder="Unidade" value={ing.unidade} onChange={e => handleIngredientChange(index, 'unidade', e.target.value)} className="col-span-3 p-3 border border-slate-300 rounded-lg" />
                                <input type="text" placeholder="Nome do ingrediente" value={ing.nome} onChange={e => handleIngredientChange(index, 'nome', e.target.value)} className="col-span-6 p-3 border border-slate-300 rounded-lg" required />
                                <button type="button" onClick={() => removeIngredient(index)} className="col-span-1 text-red-500 hover:text-red-700"><Icons name="trash" className="w-5 h-5"/></button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addIngredient} className="mt-2 text-sm font-bold text-teal hover:underline">
                        + Adicionar ingrediente
                    </button>
                </div>

                {/* Preparation */}
                <div>
                    <label htmlFor="preparo" className="block text-sm font-bold text-brand-text-primary mb-1">Modo de Preparo (um passo por linha)</label>
                    <textarea name="preparo" value={recipeData.preparo} onChange={handleChange} rows={8} className="w-full p-3 border border-slate-300 rounded-lg" required></textarea>
                </div>
                
                <div className="text-right">
                    <button type="submit" className="bg-teal text-white font-bold py-3 px-8 rounded-full hover:bg-teal/90 transition-all duration-300 shadow-md hover:shadow-lg">{buttonText}</button>
                </div>
            </form>
        </div>
    );
};

const AddRecipePage: React.FC = () => (
    <RecipeFormPage pageTitle="Adicionar Nova Receita" buttonText="Salvar Receita" />
);

const EditRecipePage: React.FC = () => {
    const { recipes } = useAppContext();
    const { id } = useParams();
    const recipeToEdit = recipes.find(r => r.id === id);
    if (!recipeToEdit) return <p>Receita não encontrada.</p>;
    return <RecipeFormPage initialData={recipeToEdit} pageTitle="Editar Receita" buttonText="Atualizar Receita" />;
};

const FavoritesPage: React.FC = () => {
    const { recipes, favorites } = useAppContext();
    const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton className="mb-4" />
            <h1 className="text-4xl font-bold text-center mb-8 text-brand-text-primary">Receitas Favoritas</h1>
            {favoriteRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteRecipes.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                </div>
            ) : (
                <p className="text-center text-brand-text-secondary">Você ainda não favoritou nenhuma receita.</p>
            )}
        </div>
    );
};

const ShoppingListPage: React.FC = () => {
    const { shoppingList, updateShoppingList } = useAppContext();
    const [newItemText, setNewItemText] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('Outros');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const todayKey = new Date().toISOString().split('T')[0];

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemText.trim() === '') return;

        const newItem: ShoppingListItem = {
            id: Date.now(),
            text: newItemText,
            category: newItemCategory,
            checked: false
        };

        const updatedList = { ...shoppingList };
        const todayItems = updatedList[todayKey] || [];
        updatedList[todayKey] = [...todayItems, newItem];

        updateShoppingList(updatedList);
        setNewItemText('');
        setNewItemCategory('Outros');
    };

    const toggleItem = (date: string, itemId: number) => {
        const updatedList = { ...shoppingList };
        updatedList[date] = updatedList[date].map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        updateShoppingList(updatedList);
    };
    
    const clearList = (date: string) => {
        if (window.confirm('Tem certeza que deseja limpar a lista deste dia?')) {
            const updatedList = { ...shoppingList };
            delete updatedList[date];
            updateShoppingList(updatedList);
            setSelectedDate(null);
        }
    };
    
    const categories = ['Frutas', 'Verduras', 'Carne', 'Laticínios', 'Padaria', 'Bebidas', 'Limpeza', 'Outros'];
    const sortedDates = Object.keys(shoppingList).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const itemsForSelectedDate = selectedDate ? shoppingList[selectedDate] : null;
    const groupedItems = itemsForSelectedDate?.reduce((acc, item) => {
        (acc[item.category] = acc[item.category] || []).push(item);
        return acc;
    }, {} as Record<string, ShoppingListItem[]>);


    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <BackButton className="mb-4" />
            <h1 className="text-4xl font-bold text-center mb-4 text-brand-text-primary">Lista de Compras</h1>
            
            <form onSubmit={handleAddItem} className="bg-brand-surface p-4 rounded-2xl shadow-lg mb-8 space-y-4">
                 <h2 className="text-xl font-bold text-brand-text-primary">Adicionar Novo Item</h2>
                 <input
                    type="text"
                    value={newItemText}
                    onChange={e => setNewItemText(e.target.value)}
                    placeholder="Ex: Leite, Ovos..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal/50 focus:border-teal/80 transition"
                />
                <div className="grid grid-cols-2 gap-4">
                    <select
                        value={newItemCategory}
                        onChange={e => setNewItemCategory(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal/50 focus:border-teal/80 transition"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <button type="submit" className="w-full bg-teal text-white font-bold py-3 px-4 rounded-lg hover:bg-teal/90 transition-all shadow-md">Adicionar</button>
                </div>
            </form>

            <h2 className="text-2xl font-bold text-brand-text-primary mb-4">Histórico de Compras</h2>
             {sortedDates.length > 0 ? (
                <div className="space-y-3">
                    {sortedDates.map(date => (
                        <button key={date} onClick={() => setSelectedDate(date)} className="w-full text-left p-4 bg-brand-surface rounded-lg shadow-md hover:shadow-lg transition-shadow flex justify-between items-center">
                            <span className="font-bold text-brand-text-primary">{new Date(date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
                            <Icons name="chevron-right" className="w-5 h-5 text-slate-500" />
                        </button>
                    ))}
                </div>
             ) : (
                <p className="text-center text-brand-text-secondary">Nenhuma lista de compras encontrada.</p>
             )}

            <AnimatePresence>
                {selectedDate && groupedItems && (
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedDate(null)}
                     >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-brand-background rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="text-xl font-bold text-brand-text-primary">{new Date(selectedDate).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</h2>
                                <button onClick={() => setSelectedDate(null)}><Icons name="x" className="w-6 h-6 text-slate-600"/></button>
                            </div>
                            <div className="p-4 overflow-y-auto">
                               {Object.keys(groupedItems).sort().map(category => (
                                    <div key={category} className="mb-4">
                                        <h3 className="font-bold text-teal mb-2">{category}</h3>
                                        <ul className="space-y-2">
                                            {groupedItems[category].map(item => (
                                                <li key={item.id} onClick={() => toggleItem(selectedDate, item.id)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${item.checked ? 'bg-slate-200' : 'bg-brand-surface'}`}>
                                                    <div className={`w-5 h-5 rounded border-2 flex-shrink-0 ${item.checked ? 'bg-soft-green border-soft-green' : 'border-slate-400'}`}>
                                                        {item.checked && <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                                    </div>
                                                    <span className={`flex-grow ${item.checked ? 'line-through text-slate-500' : 'text-brand-text-primary'}`}>{item.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 mt-auto border-t">
                                <button onClick={() => clearList(selectedDate)} className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 font-bold py-2 px-4 rounded-lg hover:bg-red-200 transition-colors">
                                   <Icons name="trash" className="w-5 h-5"/> Limpar Lista
                                </button>
                            </div>
                        </motion.div>
                     </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NotepadPage: React.FC = () => {
    const { notes } = useAppContext();
    const groupedNotes = useMemo(() => {
        const groups: Record<string, Note[]> = {};
        const sortedNotes = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        sortedNotes.forEach(note => {
            const date = note.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(note);
        });
        return groups;
    }, [notes]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        // Adjust for timezone offset to prevent date from shifting
        const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (adjustedDate.toDateString() === today.toDateString()) return 'Hoje';
        if (adjustedDate.toDateString() === yesterday.toDateString()) return 'Ontem';
        
        return new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }).format(adjustedDate);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <BackButton className="mb-4" />
            <h1 className="text-4xl font-bold text-center mb-8 text-brand-text-primary">Bloco de Notas</h1>
            
            {Object.keys(groupedNotes).length > 0 ? (
                <div className="space-y-8">
                    {Object.entries(groupedNotes).map(([date, notesOnDate]) => (
                        <div key={date}>
                            <h2 className="text-xl font-bold text-brand-text-secondary pb-2 mb-4 border-b border-slate-200">{formatDate(date)}</h2>
                            <div className="space-y-4">
                                {notesOnDate.map(note => (
                                    <Link to={`/bloco-de-notas/editar/${note.id}`} key={note.id} className="block bg-brand-surface p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <h3 className="font-bold text-xl text-brand-text-primary truncate">{note.title}</h3>
                                        <p className="text-brand-text-secondary mt-2 line-clamp-2">{note.content}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-brand-surface rounded-2xl shadow-lg">
                    <p className="text-brand-text-secondary">Você ainda não tem nenhuma anotação.</p>
                    <Link to="/bloco-de-notas/nova" className="mt-4 inline-block bg-teal text-white font-bold py-3 px-6 rounded-full hover:bg-teal/90 transition-all duration-300 shadow-md hover:shadow-lg">
                        Criar primeira anotação
                    </Link>
                </div>
            )}

            <Link to="/bloco-de-notas/nova" className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-16 h-16 bg-teal rounded-full shadow-lg text-white flex items-center justify-center hover:bg-teal/90 transform hover:scale-105 transition-all duration-300 z-30">
                <Icons name="plus" className="w-8 h-8" />
            </Link>
        </div>
    );
};

const NoteFormPage: React.FC = () => {
    const { notes, saveNote, deleteNote } = useAppContext();
    const { noteId } = useParams();
    const navigate = useNavigate();
    const existingNote = useMemo(() => noteId ? notes.find(n => n.id === noteId) : undefined, [notes, noteId]);

    const [title, setTitle] = useState(existingNote?.title || '');
    const [content, setContent] = useState(existingNote?.content || '');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('O título é obrigatório.');
            return;
        }
        saveNote({ id: existingNote?.id, title, content });
        navigate('/bloco-de-notas');
    };

    const handleDeleteClick = () => {
        if (existingNote && window.confirm('Tem certeza que deseja excluir esta anotação?')) {
            deleteNote(existingNote.id);
            navigate('/bloco-de-notas');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <BackButton className="mb-4" />
            <h1 className="text-4xl font-bold text-center mb-8 text-brand-text-primary">{existingNote ? 'Editar Anotação' : 'Nova Anotação'}</h1>
            <form onSubmit={handleSubmit} className="bg-brand-surface p-6 rounded-2xl shadow-lg space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-bold text-brand-text-primary mb-1">Título</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Título da sua anotação"
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal/50 focus:border-teal/80 transition"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-bold text-brand-text-primary mb-1">Conteúdo</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Escreva suas ideias aqui..."
                        rows={10}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal/50 focus:border-teal/80 transition"
                    />
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                    {existingNote ? (
                         <button
                            type="button"
                            onClick={handleDeleteClick}
                            className="flex items-center gap-2 text-red-600 font-bold py-3 px-6 rounded-full hover:bg-red-50 transition-colors"
                        >
                            <Icons name="trash" className="w-5 h-5"/>
                            Excluir
                        </button>
                    ) : <div />}
                    <button
                        type="submit"
                        className="bg-teal text-white font-bold py-3 px-8 rounded-full hover:bg-teal/90 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                       Salvar Anotação
                    </button>
                </div>
            </form>
        </div>
    );
};


const ScheduleRecipePage: React.FC = () => {
    const { recipes, scheduleRecipe } = useAppContext();
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const recipe = recipes.find(r => r.id === recipeId);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    if (!recipe) return <p>Receita não encontrada</p>;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        scheduleRecipe(recipe.id, date);
        alert('Receita agendada com sucesso!');
        navigate('/agenda');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <BackButton className="mb-4" />
            <h1 className="text-4xl font-bold text-center mb-2 text-brand-text-primary">Agendar Receita</h1>
            <p className="text-center text-xl text-brand-text-secondary mb-8">{recipe.nome}</p>
            <form onSubmit={handleSubmit} className="bg-brand-surface p-6 rounded-2xl shadow-lg space-y-4">
                <label htmlFor="date" className="block text-lg font-bold text-brand-text-primary">Selecione a data:</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal/50 focus:border-teal/80 transition"
                    required
                />
                <button type="submit" className="w-full bg-teal text-white font-bold py-3 px-8 rounded-full hover:bg-teal/90 transition-all duration-300 shadow-md hover:shadow-lg">Agendar</button>
            </form>
        </div>
    );
};

const SchedulePage: React.FC = () => {
    const { recipes, scheduledRecipes } = useAppContext();
    const scheduledByDate = useMemo(() => {
        const grouped: Record<string, Recipe[]> = {};
        const sorted = [...scheduledRecipes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        sorted.forEach(scheduled => {
            const recipe = recipes.find(r => r.id === scheduled.recipeId);
            if (recipe) {
                if (!grouped[scheduled.date]) {
                    grouped[scheduled.date] = [];
                }
                grouped[scheduled.date].push(recipe);
            }
        });
        return grouped;
    }, [recipes, scheduledRecipes]);

    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton className="mb-4" />
            <h1 className="text-4xl font-bold text-center mb-8 text-brand-text-primary">Minha Agenda</h1>
            {Object.keys(scheduledByDate).length > 0 ? (
                <div className="space-y-8">
                    {Object.entries(scheduledByDate).map(([date, recipesOnDate]) => (
                        <div key={date}>
                            <h2 className="text-xl font-bold text-brand-text-secondary pb-2 mb-4 border-b border-slate-200">{new Date(date).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recipesOnDate.map(recipe => (
                                    <RecipeCard key={recipe.id} recipe={recipe} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-brand-text-secondary">Nenhuma receita agendada.</p>
            )}
        </div>
    );
};

const DonationsPage: React.FC = () => {
    const { donations } = useAppContext();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <BackButton className="mb-4" />
             <div className="mb-12">
                <img 
                    src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1470&auto=format&fit=crop"
                    alt="Mãos segurando uma xícara de café, simbolizando apoio"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                />
            </div>
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-brand-text-primary">Apoie nosso Projeto</h1>
                <p className="mt-4 text-xl text-brand-text-secondary max-w-2xl mx-auto">
                    Sua generosidade é o ingrediente principal que nos permite continuar cozinhando e compartilhando novas receitas com charme e sabor.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {donations.map((donation) => (
                    <div key={donation.metodo} className="bg-brand-surface rounded-2xl shadow-lg p-6 text-center flex flex-col items-center border-t-4 border-teal hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="p-4 bg-teal/10 rounded-full mb-4">
                            <Icons name="gift" className="w-10 h-10 text-teal" />
                        </div>
                        <h2 className="text-2xl font-bold text-brand-text-primary mb-2">{donation.metodo}</h2>
                        <p className="text-brand-text-secondary flex-grow mb-6">{donation.descricao}</p>
                        <a 
                            href={donation.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto w-full bg-teal text-white font-bold py-3 px-6 rounded-full hover:bg-teal/90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                        >
                            Contribuir Agora
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ShopPage: React.FC = () => {
    const { products } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const categories = useMemo(() => ['Todos', ...Array.from(new Set(products.map(p => p.categoria)))], [products]);
    
    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'Todos') {
            return products;
        }
        return products.filter(p => p.categoria === selectedCategory);
    }, [products, selectedCategory]);

    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton className="mb-4" />
            <h1 className="text-4xl font-bold text-center mb-8 text-brand-text-primary">Loja de Utensílios</h1>
            
            <div className="flex justify-center flex-wrap gap-2 mb-8">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 font-bold rounded-full transition-colors duration-300 ${selectedCategory === category ? 'bg-teal text-white shadow-md' : 'bg-brand-surface text-brand-text-secondary hover:bg-slate-200'}`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredProducts.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </div>
    );
};

const AboutPage: React.FC = () => (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
        <BackButton className="mb-4" />
        <h1 className="text-4xl font-bold text-center mb-8 text-brand-text-primary">Sobre Nós</h1>
        <div className="mb-8">
            <img 
                src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1547&auto=format&fit=crop" 
                alt="Mesa posta com comida elegante" 
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
        </div>
        <div className="bg-brand-surface p-8 rounded-2xl shadow-lg space-y-4 text-brand-text-primary leading-relaxed">
            <p>O "Receitas com Charme" nasceu da paixão por compartilhar o prazer da culinária, transformando cada prato em uma experiência única e memorável. Acreditamos que cozinhar é um ato de amor e criatividade, e nosso objetivo é inspirar você a descobrir novos sabores, técnicas e, claro, a adicionar um toque de charme às suas criações.</p>
            <p>Nossa missão é oferecer receitas práticas e elegantes, com um foco especial na riqueza da culinária brasileira, mas sem deixar de explorar delícias de todo o mundo. Aqui, você encontrará desde o bolo de fubá da vovó até pratos mais sofisticados, todos com instruções claras e dicas para garantir o sucesso na sua cozinha.</p>
        </div>
    </div>
);

interface SuggestedRecipe {
  nome: string;
  descricao: string;
  categoria: 'Culinária Geral' | 'Pastelaria';
  ingredientes: Ingredient[];
  preparo: string[];
  tempo: string;
  porcoes: number;
  dificuldade: 'Fácil' | 'Médio' | 'Difícil';
}

const SuggestionPage: React.FC = () => {
    const { saveRecipe, toggleFavorite, isFavorite } = useAppContext();
    const [suggestion, setSuggestion] = useState<SuggestedRecipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null);

    const fetchSuggestion = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSuggestion(null);
        setSavedRecipeId(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

            const schema = {
                type: Type.OBJECT,
                properties: {
                    nome: { type: Type.STRING, description: 'Nome criativo para a receita.' },
                    descricao: { type: Type.STRING, description: 'Uma breve e atraente descrição da receita (até 2 frases).' },
                    categoria: { type: Type.STRING, description: "A categoria da receita, que deve ser 'Culinária Geral' ou 'Pastelaria'." },
                    tempo: { type: Type.STRING, description: "O tempo total de preparo. Ex: '45 min', '1h 30min'" },
                    porcoes: { type: Type.NUMBER, description: "O número de porções que a receita rende." },
                    dificuldade: { type: Type.STRING, description: "O nível de dificuldade, que deve ser 'Fácil', 'Médio' ou 'Difícil'." },
                    ingredientes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                nome: { type: Type.STRING, description: 'O nome do ingrediente. Ex: "farinha de trigo"' },
                                quantidade: { type: Type.NUMBER, description: 'A quantidade numérica do ingrediente. Usar 0 para "a gosto".' },
                                unidade: { type: Type.STRING, description: 'A unidade de medida. Ex: "xícara(s)", "g", "ml", "unidade(s)", "a gosto", "colher(es) de sopa"' }
                            },
                            required: ['nome', 'quantidade', 'unidade']
                        },
                        description: 'Lista estruturada de ingredientes.'
                    },
                    preparo: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: 'Instruções passo a passo para o preparo.'
                    }
                },
                required: ['nome', 'descricao', 'categoria', 'tempo', 'porcoes', 'dificuldade', 'ingredientes', 'preparo']
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "Sugira uma receita charmosa e deliciosa para hoje com um toque da culinária brasileira. Forneça todos os detalhes: nome, uma breve descrição atrativa, categoria ('Culinária Geral' ou 'Pastelaria'), tempo de preparo (ex: '45 min'), porções, dificuldade ('Fácil', 'Médio' ou 'Difícil'), uma lista estruturada de ingredientes (com nome, quantidade numérica e unidade) e o modo de preparo passo a passo. A receita deve ser adequada para um cozinheiro caseiro.",
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                },
            });
            
            const text = response.text.trim();
            const parsedRecipe = JSON.parse(text);
            setSuggestion(parsedRecipe);

        } catch (e) {
            console.error(e);
            setError("Oops! Nosso chef virtual está descansando. Por favor, tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuggestion();
    }, [fetchSuggestion]);
    
    const handleSave = () => {
        if (suggestion && !savedRecipeId) {
            const { descricao, ...recipeToSave } = suggestion;
            const newId = saveRecipe(recipeToSave);
            if (newId) {
                setSavedRecipeId(newId);
                alert('Receita salva com sucesso!');
            }
        }
    };

    const handleFavorite = () => {
        if (!suggestion) return;

        if (savedRecipeId) {
            toggleFavorite(savedRecipeId);
        } else {
            const { descricao, ...recipeToSave } = suggestion;
            const newId = saveRecipe(recipeToSave);
            if (newId) {
                setSavedRecipeId(newId);
                toggleFavorite(newId);
            }
        }
    };
    
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <BackButton className="mb-4" />
            <h1 className="text-4xl font-bold text-center mb-8 text-brand-text-primary">Sugestão do Dia</h1>
            
            {loading && (
                <div className="text-center py-16 bg-brand-surface rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-brand-text-secondary font-semibold">Consultando nosso chef virtual...</p>
                </div>
            )}
            {error && (
                 <div className="text-center py-16 bg-red-50 text-red-700 rounded-2xl shadow-lg p-6">
                    <p className="font-bold text-lg">Ocorreu um erro</p>
                    <p>{error}</p>
                 </div>
            )}
            {suggestion && (
                <div className="bg-brand-surface p-8 rounded-2xl shadow-lg animate-fade-in text-brand-text-primary leading-relaxed">
                    <h2 className="text-3xl font-bold text-teal mb-2 text-center">{suggestion.nome}</h2>
                    <div className="flex items-center justify-center text-brand-text-secondary text-sm mb-4 space-x-4">
                        <div className="flex items-center"><Icons name="clock" className="w-4 h-4 mr-1.5 text-soft-green" /><span>{suggestion.tempo}</span></div>
                        <div className="flex items-center"><Icons name="chef-hat" className="w-4 h-4 mr-1.5 text-soft-green" /><span>{suggestion.dificuldade}</span></div>
                        <div className="flex items-center"><Icons name="users" className="w-4 h-4 mr-1.5 text-soft-green" /><span>{suggestion.porcoes} porções</span></div>
                    </div>
                    <p className="text-brand-text-secondary mb-6 italic text-center">{suggestion.descricao}</p>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-3 border-b-2 border-teal/50 pb-2">Ingredientes</h3>
                            <ul className="space-y-2 mt-4">
                                {suggestion.ingredientes.map((ing, i) => <li key={i} className="flex items-start gap-2"><span className="text-teal font-bold mt-1.5">•</span><span>{ing.quantidade > 0 && <strong>{ing.quantidade.toLocaleString('pt-BR')} {ing.unidade}</strong>} {ing.unidade !== 'a gosto' && ing.unidade && ' de '} {ing.nome}</span></li>)}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-3 border-b-2 border-teal/50 pb-2">Modo de Preparo</h3>
                            <ol className="space-y-4 mt-4">
                                {suggestion.preparo.map((step, i) => <li key={i} className="flex items-start gap-3"><span className="font-bold text-teal mt-1">{i + 1}.</span><span>{step}</span></li>)}
                            </ol>
                        </div>
                    </div>
                    
                     <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleSave}
                            disabled={!!savedRecipeId}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-soft-green text-white font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            <Icons name={savedRecipeId ? "check" : "plus"} className="w-5 h-5" />
                            <span>{savedRecipeId ? 'Salvo!' : 'Salvar Receita'}</span>
                        </button>
                        <button
                            onClick={handleFavorite}
                            aria-label="Favoritar"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-brand-text-primary font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:text-red-500"
                        >
                            <Icons name="heart" className={`w-5 h-5 transition-colors ${savedRecipeId && isFavorite(savedRecipeId) ? 'text-red-500 fill-current' : ''}`} />
                            <span>{savedRecipeId && isFavorite(savedRecipeId) ? 'Favoritado' : 'Favoritar'}</span>
                        </button>
                    </div>
                </div>
            )}

            {!loading && (
                <div className="text-center mt-8">
                    <button 
                        onClick={fetchSuggestion} 
                        disabled={loading}
                        className="bg-teal text-white font-bold py-3 px-8 rounded-full hover:bg-teal/90 transition-all duration-300 shadow-md hover:shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                    >
                        <Icons name="sparkles" className="w-5 h-5" />
                        <span>Gerar Nova Sugestão</span>
                    </button>
                </div>
            )}
        </div>
    );
};

const LoginPage: React.FC = () => {
    const { users, login, createUser } = useAppContext();
    const [newUserName, setNewUserName] = useState('');

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUserName.trim()) {
            createUser(newUserName.trim());
            setNewUserName('');
        }
    };

    return (
        <div className="min-h-screen bg-brand-background flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <Icons name="chef-hat" className="mx-auto w-16 h-16 text-teal" />
                    <h1 className="text-4xl font-bold text-brand-text-primary mt-4">Bem-vindo(a)!</h1>
                    <p className="text-brand-text-secondary mt-2">Escolha um perfil para continuar ou crie um novo.</p>
                </div>
                
                <div className="bg-brand-surface p-6 rounded-2xl shadow-lg">
                    {users.length > 0 && (
                        <div className="space-y-3 mb-6">
                            <h2 className="font-bold text-brand-text-primary">Perfis existentes:</h2>
                            {users.map(user => (
                                <button
                                    key={user.id}
                                    onClick={() => login(user.id)}
                                    className="w-full flex items-center gap-4 p-4 bg-slate-100 rounded-lg text-left hover:bg-teal/10 hover:text-teal transition-colors"
                                >
                                    <Icons name="user" className="w-6 h-6 text-teal" />
                                    <span className="text-lg font-semibold">{user.name}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <div>
                        <h2 className="font-bold text-brand-text-primary mb-3">Criar um novo perfil:</h2>
                        <form onSubmit={handleCreateUser} className="flex gap-2">
                            <input
                                type="text"
                                value={newUserName}
                                onChange={e => setNewUserName(e.target.value)}
                                placeholder="Seu nome de chef"
                                className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal/50"
                                required
                            />
                            <button
                                type="submit"
                                className="bg-teal text-white font-bold p-3 rounded-lg hover:bg-teal/90 transition-colors shadow"
                            >
                                Criar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- APP PROVIDER & MAIN APP ---
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [allData, setAllData] = useState<AppData>({
        users: [],
        userData: {},
        currentUserId: null
    });
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Initial load from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem('receitasComCharmeData');
        let data: AppData;
        if (storedData) {
            data = JSON.parse(storedData);
        } else {
            // Default empty state if nothing is stored
            data = { users: [], userData: {}, currentUserId: null };
        }
        setAllData(data);

        // Auto-login if there was a logged-in user
        if (data.currentUserId) {
            const userToLogin = data.users.find(u => u.id === data.currentUserId);
            if (userToLogin) {
                setCurrentUser(userToLogin);
            }
        }
    }, []);

    // Persist data to localStorage on change
    useEffect(() => {
        localStorage.setItem('receitasComCharmeData', JSON.stringify(allData));
    }, [allData]);
    
    const login = (userId: string) => {
        const user = allData.users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
            setAllData(prev => ({ ...prev, currentUserId: userId }));
        }
    };
    
    const logout = () => {
        setCurrentUser(null);
        setAllData(prev => ({ ...prev, currentUserId: null }));
    };

    const createUser = (name: string) => {
        const newUserId = `local_user_${Date.now()}`;
        const newUser: User = { id: newUserId, name };
        const newUserData: UserData = {
            favorites: [],
            scheduledRecipes: [],
            notes: [],
            shoppingList: {},
            recipes: [],
        };

        setAllData(prev => ({
            users: [...prev.users, newUser],
            userData: { ...prev.userData, [newUserId]: newUserData },
            currentUserId: newUserId, // Automatically log in the new user
        }));
        setCurrentUser(newUser);
    };

    const currentUserData = currentUser ? allData.userData[currentUser.id] || { favorites: [], scheduledRecipes: [], notes: [], shoppingList: {}, recipes: [] } : { favorites: [], scheduledRecipes: [], notes: [], shoppingList: {}, recipes: [] };

    const updateUserData = (updatedData: Partial<UserData>) => {
        if (!currentUser) return;
        setAllData(prev => ({
            ...prev,
            userData: {
                ...prev.userData,
                [currentUser.id]: {
                    ...currentUserData,
                    ...updatedData,
                }
            }
        }));
    };
    
    const toggleFavorite = useCallback((id: string) => {
        if (!currentUser) return;
        const newFavorites = currentUserData.favorites.includes(id)
            ? currentUserData.favorites.filter(favId => favId !== id)
            : [...currentUserData.favorites, id];
        updateUserData({ favorites: newFavorites });
    }, [currentUser, currentUserData]);
    
    const isFavorite = useCallback((id: string) => currentUserData.favorites.includes(id), [currentUserData]);

    const scheduleRecipe = (recipeId: string, date: string) => {
        const newScheduled: ScheduledRecipe = { id: Date.now().toString(), recipeId, date };
        updateUserData({ scheduledRecipes: [...currentUserData.scheduledRecipes, newScheduled] });
    };

    const saveNote = (noteData: { id?: string; title: string; content: string; }) => {
        const date = new Date().toISOString().split('T')[0];
        if (noteData.id) { // Update
            const newNotes = currentUserData.notes.map(n => n.id === noteData.id ? { ...n, ...noteData, date } : n);
            updateUserData({ notes: newNotes });
        } else { // Create
            const newNote: Note = { ...noteData, id: Date.now().toString(), date };
            updateUserData({ notes: [...currentUserData.notes, newNote] });
        }
    };

    const deleteNote = (id: string) => {
        updateUserData({ notes: currentUserData.notes.filter(n => n.id !== id) });
    };

    const updateShoppingList = (list: ShoppingList) => {
        updateUserData({ shoppingList: list });
    };

    const saveRecipe = (recipeData: Omit<Recipe, 'id' | 'user_id' | 'views'| 'imagem_urls'> & { id?: string }): string | undefined => {
        if (!currentUser) return undefined;
        if (recipeData.id) { // Update existing recipe
             const updatedRecipes = allData.userData[currentUser.id].recipes.map(r => r.id === recipeData.id ? { ...r, ...recipeData } as Recipe : r);
             updateUserData({ recipes: updatedRecipes });
             return recipeData.id;
        } else { // Add new recipe
            const newId = `user_recipe_${Date.now()}`;
            const newRecipe: Recipe = {
                ...recipeData,
                id: newId,
                user_id: currentUser.id,
                views: 0,
                imagem_urls: ['https://picsum.photos/800/600?random=' + Date.now()],
            };
            updateUserData({ recipes: [...allData.userData[currentUser.id].recipes, newRecipe] });
            return newId;
        }
    };

    const deleteRecipe = (id: string) => {
        if (!currentUser) return;
        updateUserData({
            recipes: allData.userData[currentUser.id].recipes.filter(r => r.id !== id)
        });
    };

    const contextValue: AppContextType = {
        currentUser,
        users: allData.users,
        login,
        logout,
        createUser,
        recipes: [...mockRecipes, ...Object.values(allData.userData).flatMap(ud => ud.recipes)],
        products: mockProducts,
        donations: mockDonations,
        favorites: currentUserData.favorites,
        toggleFavorite,
        isFavorite,
        scheduledRecipes: currentUserData.scheduledRecipes,
        scheduleRecipe,
        notes: currentUserData.notes,
        saveNote,
        deleteNote,
        shoppingList: currentUserData.shoppingList,
        updateShoppingList,
        saveRecipe,
        deleteRecipe,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

const App: React.FC = () => {
    const { currentUser } = useAppContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
      // Hide splash screen after initial load
      const splash = document.getElementById('splash-screen');
      if (splash) {
        setTimeout(() => {
          splash.classList.add('hide');
        }, 1500);
      }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);
    
    if (!currentUser) {
        return <LoginPage />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <main className="flex-grow mb-16 md:mb-0">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
                        <Route path="/receitas" element={<PageWrapper><RecipesPage /></PageWrapper>} />
                        <Route path="/receita/:id" element={<PageWrapper><RecipeDetailPage /></PageWrapper>} />
                        <Route path="/perfil" element={<PageWrapper><ProfilePage /></PageWrapper>} />
                        <Route path="/minhas-receitas" element={<PageWrapper><MyRecipesPage /></PageWrapper>} />
                        <Route path="/adicionar-receita" element={<PageWrapper><AddRecipePage /></PageWrapper>} />
                        <Route path="/editar-receita/:id" element={<PageWrapper><EditRecipePage /></PageWrapper>} />
                        <Route path="/favoritas" element={<PageWrapper><FavoritesPage /></PageWrapper>} />
                        <Route path="/lista-de-compras" element={<PageWrapper><ShoppingListPage /></PageWrapper>} />
                        <Route path="/bloco-de-notas" element={<PageWrapper><NotepadPage /></PageWrapper>} />
                        <Route path="/bloco-de-notas/nova" element={<PageWrapper><NoteFormPage /></PageWrapper>} />
                        <Route path="/bloco-de-notas/editar/:noteId" element={<PageWrapper><NoteFormPage /></PageWrapper>} />
                        <Route path="/programar/:recipeId" element={<PageWrapper><ScheduleRecipePage /></PageWrapper>} />
                        <Route path="/agenda" element={<PageWrapper><SchedulePage /></PageWrapper>} />
                        <Route path="/doacoes" element={<PageWrapper><DonationsPage /></PageWrapper>} />
                        <Route path="/loja" element={<PageWrapper><ShopPage /></PageWrapper>} />
                        <Route path="/sobre" element={<PageWrapper><AboutPage /></PageWrapper>} />
                        <Route path="/sugestao-do-dia" element={<PageWrapper><SuggestionPage /></PageWrapper>} />
                    </Routes>
                </AnimatePresence>
            </main>
            <BottomNav />
            <Footer />
        </div>
    );
};

const AppWrapper = () => (
    <HashRouter>
        <AppProvider>
            <App />
        </AppProvider>
    </HashRouter>
);

export default AppWrapper;
