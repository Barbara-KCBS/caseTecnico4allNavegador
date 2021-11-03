
function gerarArquivoJson(){

	$.ajax({
		dataType : "json",
		url : "data.json",
	
	})
	.done(function(result){
        let estabelecimento = result.establishments;
        let produtos = result.products;
        let categoria = result.categories;
        let construindoJson = "";  
        let listaDeStrings = [];
        let mediasDosEstabelecimentos = [];
        
        // Percorre a lista de estabelecimentos
        estabelecimento.forEach(function(nome, indiceEstabelecimento){
            let construindoString = "";
            let totalDeProdutosDoEstabelecimento = estabelecimento[indiceEstabelecimento].productsId.length;
            let precoDeTodosOsProdutos = [];
            let somaDosPrecos = 0;           
            let nomeDoEstabelecimento = estabelecimento[indiceEstabelecimento].name;
            let produtosDoEstabelecimento = estabelecimento[indiceEstabelecimento].productsId;
          
            // Percorre todas as categorias do arquivo json
            categoria.forEach(function(nome, indiceDacategoria){
                let idDacategoria = categoria[indiceDacategoria].id;
                let nomeDaCategoria = categoria[indiceDacategoria].name;
                let categoriaComProduto = `"${nomeDaCategoria}":{`;
                let localizouProdutoNoEstabelecimento = false;
                
                // Percorre todos os produtos do arquivo json
                produtos.forEach(function(nome, indiceDeProdutos){
        
                    let idDoProduto = produtos[indiceDeProdutos].id; 
                    let categoriaDoProduto = produtos[indiceDeProdutos].categoriesId;
                    let nomeDoProduto = produtos[indiceDeProdutos].name;
                    let precoDoProduto = Number(produtos[indiceDeProdutos].price);
        
                    // Percorre todos os produtos disponiveis no estabelecimento
                    produtosDoEstabelecimento.forEach(function(nome, indiceDoProdutoDoEstabelecimento){
                        let idDoProdutoDoEstabelecimento = produtosDoEstabelecimento[indiceDoProdutoDoEstabelecimento];
                        
                        if(idDoProdutoDoEstabelecimento === idDoProduto){                       
                           
                            // Percorre todas as categorias que o produto pertence
                            categoriaDoProduto.forEach(function(nome, indiceDaCategoriaDeProdutos){
                                let idDaCategoriaDoProdutoDoEstabelecimento = categoriaDoProduto[indiceDaCategoriaDeProdutos];
                                
                                // Entra nesta condição quando encontrar a categoria que o produto pertence
                                if(idDaCategoriaDoProdutoDoEstabelecimento === idDacategoria){
                                    precoDeTodosOsProdutos.push(precoDoProduto);
                                    precoDeTodosOsProdutos = [...new Set(precoDeTodosOsProdutos)];
                                    localizouProdutoNoEstabelecimento = true;                                                       
                                    categoriaComProduto += `"${nomeDoProduto}":{"price": "${(precoDoProduto/100).toFixed(2)}"},` 
                                                                       
                                }
                            })
                        }                      
                    })      
                })
                
        
                if(localizouProdutoNoEstabelecimento === true){                                             
                    categoriaComProduto = categoriaComProduto.substring(0, categoriaComProduto.length - 1);
                    construindoString += `${categoriaComProduto}},`;  
                }
        
                if(indiceDacategoria === categoria.length - 1){
                    construindoString = construindoString.substring(0, construindoString.length - 1);
                    construindoString += "},"
                }
               
                
            })
             // Soma os todos os preços dos produtos do estabelecimento e calcula sua média
            precoDeTodosOsProdutos.forEach(function(nome, i){
                somaDosPrecos += precoDeTodosOsProdutos[i];
            })
        
            let avgPrice = ((somaDosPrecos / totalDeProdutosDoEstabelecimento)/100).toFixed(2);
            mediasDosEstabelecimentos.push(avgPrice);
        
            // conclusão da string com os dados de determinado estabelecimento
            let construcaoConcluida =  `"${nomeDoEstabelecimento}":{"avgPrice":"${avgPrice}", ${construindoString}`;
            let stringEMediaDosEstabelecimentos = { estabelecimentoString: construcaoConcluida, media: avgPrice }
            listaDeStrings.push(stringEMediaDosEstabelecimentos);
        })
        
        
        
        // Ordena, de forma decrescente, o array com as médias da soma dos produtos de todos os estabelecimentos
        function sortfunction(a, b){
             return (a - b) 
        }
        mediasDosEstabelecimentos.sort(sortfunction);
        mediasDosEstabelecimentos.reverse();
        
        //Compara as médias dos arrays com as médias dos estabelecimentos e faz a construção da string em ordem descrescente 
        mediasDosEstabelecimentos.forEach(function(nome, indiceDaMedia){
            let mediaAtual = mediasDosEstabelecimentos[indiceDaMedia];
        
            listaDeStrings.forEach(function(nome, indiceDaLista){
                if(listaDeStrings[indiceDaLista].media === mediaAtual){
                    construindoJson += listaDeStrings[indiceDaLista].estabelecimentoString;
                }
            })
        })
        
        construindoJson = construindoJson.substring(0, construindoJson.length - 1); 
        
        construindoJson = `{${construindoJson}}`;
        construindoJson = JSON.parse(construindoJson);
        construindoJson = JSON.stringify(construindoJson, null, 3);

        let nomeDoArquivo = "caseTecnico4All";
        let blob = new Blob([construindoJson], {type: "text/plain;charset=utf-8"})
        saveAs(blob, nomeDoArquivo + ".json");
	
	})
	.fail(function(jqXHR, textStatus, msg){
		console.log('A requisição falhou e retornou com a seguinte mensagem: ' + msg);
	});
   
}

$(".botao-gerar-arquivo").on("click", gerarArquivoJson);
