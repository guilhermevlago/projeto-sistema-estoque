export function gerarCSVMovimentacoes(movs) {
  const header = [
    'Data',
    'Produto',
    'Categoria',
    'Marca',
    'Localização',
    'Tipo',
    'Quantidade',
    'Responsável',
    'Motivo',
    'Observação'
  ];
  let csv = header.join(',') + '\n';

  movs.forEach(mov => {
    csv += [
      new Date(mov.created_at).toLocaleDateString('pt-BR'),
      `"${mov.produto_nome || ''}"`,
      `"${mov.categoria_produto || ''}"`,
      `"${mov.marca_produto || ''}"`,
      `"${mov.localizacao_produto || ''}"`,
      mov.tipo,
      mov.quantidade,
      `"${mov.responsavel_nome || ''}"`,
      `"${mov.motivo || ''}"`,
      `"${mov.observacao || ''}"`
    ].join(',') + '\n';
  });

  return csv;
}

export function gerarCSVProdutos(produtos) {
  const header = [
    'SKU',
    'Nome',
    'Descrição',
    'Categoria',
    'Marca',
    'Localização',
    'Preço de Venda',
    'Estoque Atual',
    'Estoque Mínimo',
    'É Kit',
    'Quantidade por Kit'
  ];
  let csv = header.join(',') + '\n';

  produtos.forEach(produto => {
    csv += [
      `"${produto.sku || ''}"`,
      `"${produto.nome || ''}"`,
      `"${produto.descricao || ''}"`,
      `"${produto.categoria || ''}"`,
      `"${produto.marca || ''}"`,
      `"${produto.localizacao_fisica || ''}"`,
      produto.preco_venda || 0,
      produto.estoque_atual ?? 0,
      produto.estoque_minimo ?? 0,
      produto.eh_kit ? 'Sim' : 'Não',
      produto.eh_kit ? (produto.quantidade_por_kit || '') : ''
    ].join(',') + '\n';
  });

  return csv;
}

export function baixarCSV(conteudo, nomeArquivo) {
  const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', nomeArquivo);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function formatarDataParaArquivo(data = new Date()) {
  return data.toISOString().slice(0, 10).replace(/-/g, '');
}

export function escaparCSV(valor) {
  if (valor === null || valor === undefined) return '';
  const str = String(valor);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}