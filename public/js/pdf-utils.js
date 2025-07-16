// Função para exportar relatório do dashboard como PDF
async function exportarDashboardParaPDF({ incluirGrafico = false } = {}) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'mm', 'a4');
  let y = 18;

  doc.setFontSize(18);
  doc.text('Relatório do Dashboard', 148.5, y, { align: 'center' });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 148.5, y, { align: 'center' });
  y += 10;

  if (incluirGrafico) {
    const canvas = document.getElementById('canvas-movimentacoes');
    if (canvas) {
      const imgData = canvas.toDataURL('image/png');
      const graphWidth = 180;
      const graphHeight = 80;
      const graphX = (297 - graphWidth) / 2;
      doc.addImage(imgData, 'PNG', graphX, y, graphWidth, graphHeight);
      y += graphHeight + 5;
    }
  }

  doc.setFontSize(13);
  doc.setTextColor(30);
  doc.text('Movimentações Recentes', 14, y + 8);
  y += 12;

  doc.setFontSize(10);
  doc.setFillColor(230, 230, 230);
  doc.rect(12, y, 273, 10, 'F');
  doc.setTextColor(50);

  const colunas = [
    { label: 'Data', x: 14, width: 25 },
    { label: 'Produto', x: 39, width: 40 },
    { label: 'Categoria', x: 79, width: 30 },
    { label: 'Marca', x: 109, width: 25 },
    { label: 'Localização', x: 134, width: 30 },
    { label: 'Tipo', x: 164, width: 18 },
    { label: 'Qtd', x: 182, width: 16 },
    { label: 'Responsável', x: 198, width: 35 },
    { label: 'Motivo', x: 233, width: 25 },
    { label: 'Observação', x: 258, width: 25 }
  ];

  function desenharLinhasVerticaisCabecalho(yPos, altura) {
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.2);
    
    for (let i = 1; i < colunas.length; i++) {
      const x = colunas[i].x - 2;
      doc.line(x, yPos, x, yPos + altura);
    }
  }

  colunas.forEach(col => {
    if (col.label === 'Qtd') {
      doc.text(col.label, col.x + (col.width / 2), y + 7, { align: 'center' });
    } else {
      doc.text(col.label, col.x, y + 7);
    }
  });
  
  desenharLinhasVerticaisCabecalho(y, 10);
  y += 11;

  const token = localStorage.getItem('token');
  
  const resProdutos = await fetch('https://projeto-sistema-estoque-production.up.railway.app/api/produtos', {
    headers: { Authorization: 'Bearer ' + token }
  });
  let produtos = [];
  if (resProdutos.ok) {
    produtos = await resProdutos.json();
  }
  
  const res = await fetch('https://projeto-sistema-estoque-production.up.railway.app/api/movimentacoes', {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!res.ok) {
    alert('Erro ao buscar dados');
    return;
  }
  const movs = await res.json();

  const tipoSelecionados = [];
  if (document.getElementById('relatorio-entrada')?.checked) tipoSelecionados.push('entrada');
  if (document.getElementById('relatorio-saida')?.checked) tipoSelecionados.push('saida');
  if (document.getElementById('relatorio-cadastro')?.checked) tipoSelecionados.push('cadastro');

  const dataInicio = document.getElementById('relatorio-data-inicio')?.value;
  const dataFim = document.getElementById('relatorio-data-fim')?.value;

  const movsFiltrados = movs.filter(mov => {
    const tipoOk = tipoSelecionados.includes(mov.tipo);
    let dataOk = true;
    if (dataInicio) dataOk = dataOk && new Date(mov.created_at) >= new Date(dataInicio);
    if (dataFim) dataOk = dataOk && new Date(mov.created_at) <= new Date(dataFim + 'T23:59:59');
    return tipoOk && dataOk;
  });

  const movsEnriquecidas = movsFiltrados.map(mov => {
    const produto = produtos.find(p => p.id === mov.produto_id);
    return {
      ...mov,
      categoria_produto: produto?.categoria || '',
      marca_produto: produto?.marca || '',
      localizacao_produto: produto?.localizacao_fisica || ''
    };
  });

  doc.setFontSize(9);
  doc.setTextColor(80);
  
  const alturaLinha = 10;

  function desenharLinhasVerticaisLinha(yPos, altura) {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.15);
    
    for (let i = 1; i < colunas.length; i++) {
      const x = colunas[i].x - 2;
      doc.line(x, yPos, x, yPos + altura);
    }
  }
  
  movsEnriquecidas.slice(0, 25).forEach((mov, index) => {
    if (y > 185) { doc.addPage(); y = 18; }
    
    if (index > 0) {
      doc.setDrawColor(120, 120, 120);
      doc.setLineWidth(0.3);
      doc.line(13, y - 1, 283, y - 1);
    }

    doc.text(new Date(mov.created_at).toLocaleDateString('pt-BR'), colunas[0].x, y + 6);
    doc.text(String(mov.produto_nome || '').substring(0, 25), colunas[1].x, y + 6);
    doc.text(String(mov.categoria_produto || '').substring(0, 18), colunas[2].x, y + 6);
    doc.text(String(mov.marca_produto || '').substring(0, 15), colunas[3].x, y + 6);
    doc.text(String(mov.localizacao_produto || '').substring(0, 18), colunas[4].x, y + 6);
    doc.text(String(mov.tipo || ''), colunas[5].x, y + 6);
    doc.text(String(mov.quantidade || ''), colunas[6].x + (colunas[6].width / 2), y + 6, { align: 'center' });
    doc.text(String(mov.responsavel_nome || '').substring(0, 22), colunas[7].x, y + 6);
    doc.text(String(mov.motivo || '').substring(0, 15), colunas[8].x, y + 6);
    doc.text(String(mov.observacao || '').substring(0, 15), colunas[9].x, y + 6);
    
    desenharLinhasVerticaisLinha(y - 1, alturaLinha);
    
    y += alturaLinha;
  });

  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.5);
  doc.line(13, y - 1, 283, y - 1);

  doc.save('relatorio_dashboard.pdf');
}

async function exportarProdutosParaPDF(produtos, titulo = 'Relatório de Produtos') {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('l', 'mm', 'a4');
  let y = 18;

  doc.setFontSize(18);
  doc.text(titulo, 148.5, y, { align: 'center' });
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 148.5, y, { align: 'center' });
  y += 15;

  const colunas = [
    { label: 'SKU', x: 14, width: 25 },
    { label: 'Nome', x: 39, width: 50 },
    { label: 'Categoria', x: 89, width: 30 },
    { label: 'Marca', x: 119, width: 25 },
    { label: 'Localização', x: 144, width: 30 },
    { label: 'Preço', x: 174, width: 20 },
    { label: 'Estoque', x: 194, width: 18 },
    { label: 'Est. Min', x: 212, width: 18 },
    { label: 'Kit', x: 230, width: 15 },
    { label: 'Qtd/Kit', x: 245, width: 20 }
  ];

  doc.setFontSize(10);
  doc.setFillColor(230, 230, 230);
  doc.rect(12, y, 273, 10, 'F');
  doc.setTextColor(50);

  colunas.forEach(col => {
    if (['Preço', 'Estoque', 'Est. Min', 'Kit', 'Qtd/Kit'].includes(col.label)) {
      doc.text(col.label, col.x + (col.width / 2), y + 7, { align: 'center' });
    } else {
      doc.text(col.label, col.x, y + 7);
    }
  });

  function desenharLinhasVerticais(yPos, altura) {
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.2);
    
    for (let i = 1; i < colunas.length; i++) {
      const x = colunas[i].x - 2;
      doc.line(x, yPos, x, yPos + altura);
    }
  }

  desenharLinhasVerticais(y, 10);
  y += 11;

  doc.setFontSize(9);
  doc.setTextColor(80);
  
  const alturaLinha = 8;

  produtos.forEach((produto, index) => {
    if (y > 185) { 
      doc.addPage(); 
      y = 18;
      
      doc.setFontSize(10);
      doc.setFillColor(230, 230, 230);
      doc.rect(12, y, 273, 10, 'F');
      doc.setTextColor(50);
      
      colunas.forEach(col => {
        if (['Preço', 'Estoque', 'Est. Min', 'Kit', 'Qtd/Kit'].includes(col.label)) {
          doc.text(col.label, col.x + (col.width / 2), y + 7, { align: 'center' });
        } else {
          doc.text(col.label, col.x, y + 7);
        }
      });
      
      desenharLinhasVerticais(y, 10);
      y += 11;
      doc.setFontSize(9);
      doc.setTextColor(80);
    }
    
    if (index > 0) {
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.2);
      doc.line(13, y - 1, 283, y - 1);
    }

    doc.text(String(produto.sku || '').substring(0, 15), colunas[0].x, y + 5);
    doc.text(String(produto.nome || '').substring(0, 35), colunas[1].x, y + 5);
    doc.text(String(produto.categoria || '').substring(0, 20), colunas[2].x, y + 5);
    doc.text(String(produto.marca || '').substring(0, 15), colunas[3].x, y + 5);
    doc.text(String(produto.localizacao_fisica || '').substring(0, 20), colunas[4].x, y + 5);
    doc.text(produto.preco_venda ? `R$ ${produto.preco_venda.toFixed(2)}` : '-', colunas[5].x + (colunas[5].width / 2), y + 5, { align: 'center' });
    doc.text(String(produto.estoque_atual ?? '-'), colunas[6].x + (colunas[6].width / 2), y + 5, { align: 'center' });
    doc.text(String(produto.estoque_minimo ?? '-'), colunas[7].x + (colunas[7].width / 2), y + 5, { align: 'center' });
    doc.text(produto.eh_kit ? 'Sim' : 'Não', colunas[8].x + (colunas[8].width / 2), y + 5, { align: 'center' });
    doc.text(produto.eh_kit ? String(produto.quantidade_por_kit || '-') : '-', colunas[9].x + (colunas[9].width / 2), y + 5, { align: 'center' });
    
    desenharLinhasVerticais(y - 1, alturaLinha);
    
    y += alturaLinha;
  });

  doc.setDrawColor(80, 80, 80);
  doc.setLineWidth(0.5);
  doc.line(13, y - 1, 283, y - 1);

  const nomeArquivo = titulo.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '.pdf';
  doc.save(nomeArquivo);
}

function formatarDataParaPDF(data = new Date()) {
  return data.toLocaleDateString('pt-BR');
}

function truncarTexto(texto, limite) {
  if (!texto) return '';
  return String(texto).length > limite ? String(texto).substring(0, limite - 3) + '...' : String(texto);
}

if (typeof window !== 'undefined') {
  window.exportarDashboardParaPDF = exportarDashboardParaPDF;
  window.exportarProdutosParaPDF = exportarProdutosParaPDF;
}