# Observatório de Circulação Cultural

Projeto derivado de `dizzyx/daily-social-report` para investigar quais filmes, livros, músicas e temas circulam mais nas plataformas externas e quais formas de circulação produzem diálogo.

## Pergunta principal

Quais obras e temas:

- são mais replicados;
- recebem mais respostas;
- são mais compartilhados;
- geram respostas mais longas;
- atravessam mais plataformas;
- crescem mais rapidamente;
- apresentam maior probabilidade de viralização?

O sistema não reduz relevância a curtidas. Ele cruza exposição, circulação, resposta e conteúdo discursivo.

## Fonte central de teste: Threads Insights

O primeiro laboratório será o Threads. Cada publicação deve ser consultada pelo identificador da publicação e receber snapshots periódicos de `views`, `likes`, `replies`, `reposts`, `quotes` e `shares`, quando disponíveis para a conta e para o tipo de publicação. O Threads é o eixo inicial porque permite observar circulação e resposta discursiva no mesmo ambiente.

A coleta terá três camadas combináveis:

1. Insights oficiais da conta/publicação autorizada;
2. leitura da interface autenticada via CATCHER/Playwright, quando o dado estiver visível na sessão;
3. análise textual das respostas, preservando comprimento, encadeamento, idioma, tema e horário.

A saída das três camadas será uma mesma série de `metric_snapshots`, com `capture_method` e `captured_at` preservados.

## Fontes externas

- Instagram: Graph API para contas profissionais autorizadas; CATCHER/Playwright para captura observacional autorizada da interface.
- Threads: API/Insights para publicações e contas autorizadas; Playwright para leitura do que estiver disponível na sessão.
- X: API v2 e captura autorizada da interface.
- YouTube: Data API para metadados/comentários e Analytics API para métricas detalhadas de canais autorizados.
- Outras redes: conectores adaptadores, sempre preservando a origem e o método de captura.

## Identidade da publicação

Nunca usar apenas o título da obra ou o texto da legenda como chave.

```json
{
  "platform": "threads",
  "platform_post_id": "123456",
  "canonical_url": "https://www.threads.net/@perfil/post/...",
  "account_id": "perfil-origem",
  "published_at": "2026-11-08T01:00:00Z",
  "captured_at": "2026-11-08T03:00:00Z",
  "capture_method": "official_api",
  "obra_ids": ["filme-matraga"],
  "theme_labels": ["plantas", "memória", "território"],
  "content": {
    "text": "...",
    "transcript": "...",
    "ocr": "..."
  },
  "metrics": {
    "views": 4300,
    "likes": 120,
    "replies": 34,
    "shares": 18,
    "reposts": 12,
    "quotes": 7
  }
}
```

O mesmo `platform_post_id` recebe vários snapshots. Assim, o sistema calcula crescimento, aceleração e tempo até o pico sem perder o histórico.

## Extração do tema

A vinculação entre publicação e obra pode ser:

1. explícita: título, hashtag, menção ou seleção do pesquisador;
2. textual: legenda, descrição, comentário ou transcrição;
3. audiovisual: OCR, frames e reconhecimento de cenas;
4. semântica: embeddings, entidades e classificação temática;
5. curatorial: confirmação humana ou associação ao catálogo.

A identificação automática deve produzir evidência e confiança, não substituir a curadoria.

## Métricas normalizadas

Cada plataforma mantém seus nomes e valores brutos. O observatório também calcula indicadores comparáveis:

- `replication_rate = (reposts + retweets + quotes) / exposure`;
- `reply_rate = replies / exposure`;
- `share_rate = shares / exposure`;
- `conversation_depth = replies_with_replies / replies`;
- `mean_reply_length = total_reply_characters / reply_count`;
- `cross_platform_spread = number_of_platforms_with_matching_theme`;
- `growth_velocity = delta(exposure) / hours`;
- `peak_acceleration = delta(growth_velocity)`.

Os denominadores devem ser preservados. Alcance, visualizações, impressões e contas alcançadas não são equivalentes entre plataformas.

## Consultas cruzadas e temperatura

Cada consulta pode ser executada em três níveis:

- `broad`: tema amplo, como `plantas`, `memória popular` ou `cinema brasileiro`;
- `focused`: obra, personagem, cena ou termo específico, como `Matraga`, `mulungu` ou `Sinners`;
- `comparative`: vários termos ou obras comparados na mesma janela.

Para cada consulta, gerar Top 5, Top 10 e Top 20 por circulação. A mesma consulta pode cruzar Threads com Google Trends, sem misturar os valores: Threads mede interação social observada; Google Trends mede interesse agregado de busca.

O cruzamento mínimo é:

- pico de visualizações no Threads;
- pico de respostas e compartilhamentos;
- comprimento médio e profundidade das respostas;
- velocidade de crescimento;
- interesse de busca no Google Trends;
- defasagem entre o pico social e o pico de busca.

Google Trends entra como contexto externo. A API oficial está em acesso alfa; enquanto o acesso não estiver disponível, usar exportação da interface ou um provedor explicitamente identificado, sem fingir que é a API oficial. A escala do Trends é interesse relativo, não volume absoluto.

## Potencial de circulação

O ranking deve ser apresentado como sinal analítico, não como verdade causal.

Uma primeira pontuação pode ser:

```text
circulation_score =
  0.20 * normalized_replication_rate
+ 0.20 * normalized_share_rate
+ 0.15 * normalized_reply_rate
+ 0.15 * normalized_mean_reply_length
+ 0.15 * normalized_growth_velocity
+ 0.15 * normalized_cross_platform_spread
```

A pontuação deve mostrar também:

- tamanho da amostra;
- período observado;
- plataforma;
- método de captura;
- campos ausentes;
- intervalo de confiança ou grau de incerteza.

## Modelo mínimo de dados

Entidades principais:

- `works`: filmes, livros, músicas e outras obras;
- `themes`: temas, conceitos, práticas e marcadores;
- `posts`: publicações externas;
- `post_work_links`: vínculo entre publicação e obra;
- `post_theme_links`: vínculo entre publicação e tema;
- `metric_snapshots`: série temporal de métricas;
- `responses`: comentários, respostas, citações e textos derivados;
- `captures`: evidência, método, horário e origem da coleta;
- `rankings`: resultados calculados com versão do modelo.

## Primeira entrega técnica

1. preservar os adaptadores existentes;
2. tratar Threads Insights como primeiro adaptador real;
3. suportar consultas `broad`, `focused` e `comparative`;
4. gerar Top 5, Top 10 e Top 20;
5. integrar Google Trends como série contextual;
6. preservar método, timestamp e campos ausentes;
7. manter uma saída unificada para todos os conectores;
8. 
9. acrescentar `platform_post_id`, `obra_ids`, `theme_labels` e `captured_at`;
10. armazenar snapshots em vez de sobrescrever métricas;
11. implementar ranking por obra e por tema;
12. separar métricas públicas de métricas disponíveis apenas para contas autorizadas;
13. criar uma tela de comparação por plataforma;
14. incluir evidência textual das respostas mais longas e representativas.

## Limite metodológico

“Viral” será tratado como potencial observado a partir de sinais de circulação, não como previsão garantida. Uma obra pode ter muitas visualizações e pouco diálogo; outra pode ter menos alcance e gerar respostas longas, replicação comunitária e circulação entre plataformas. O sistema precisa manter essas diferenças visíveis.
