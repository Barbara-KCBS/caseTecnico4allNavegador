
function gerarArquivoJson(){

	$.ajax({
		dataType: "json",
		url: "data.json",
	
	})
	.done(function(result){
        let establishments = result.establishments;
        let products = result.products;
        let categories = result.categories;
        
        var outputDataString = "";  
        var stringAndAvgOfEstablisments = [];
        var establishmentsPriceAvg = [];
        
        establishments.forEach(function(establishment){
            let establishmentString = "";
            let productWithPrice = [];
            let sumOfPrices = 0;           
           
            categories.forEach(function(category){
                let categoryAndProduct = `"${category.name}":{`;
                let foundProduct = false;
                
                products.forEach(function(product){
                    establishment.productsId.forEach(function(estableshmentProducts){
                        if(estableshmentProducts === product.id){                       
                            product.categoriesId.forEach(function(productCategory){
                                if(productCategory === category.id){
                                    productWithPrice.push({ name: product.name, price: Number(product.price)});
                                    foundProduct = true;                                                  
                                    categoryAndProduct += `"${product.name}":{"price": "${(Number(product.price)/100).toFixed(2)}"},` 
                                                                       
                                }
                            })
                        }                      
                    })      
                })  
        
                if(foundProduct === true){                                             
                    categoryAndProduct = categoryAndProduct.substring(0, categoryAndProduct.length - 1);
                    establishmentString += `${categoryAndProduct}},`;  
                }
                
            })
        
            productWithPrice = productWithPrice.filter(function (a) {
                return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
            }, Object.create(null))
            
            productWithPrice.forEach(function(productAndPrice){
                sumOfPrices += productAndPrice.price;
            })
        
            let avgPrice = ((sumOfPrices / establishment.productsId.length)/100).toFixed(2);
            establishmentsPriceAvg.push(avgPrice);
        
            establishmentString = establishmentString.substring(0, establishmentString.length - 1);
            establishmentString =  `"${establishment.name}":{"avgPrice":"${avgPrice}", ${establishmentString}},`;
            stringAndAvgOfEstablisments.push({ stringEstablishmentData: establishmentString, avg: avgPrice });
        })
        
        function sortfunction(a, b){
             return (a - b) 
        }
        establishmentsPriceAvg.sort(sortfunction);
        establishmentsPriceAvg.reverse();
        
        establishmentsPriceAvg.forEach(function(currentAvg){
            stringAndAvgOfEstablisments.forEach(function(establishmentData){
                if(establishmentData.avg === currentAvg){
                    outputDataString += establishmentData.stringEstablishmentData;
                }
            })
        })
        
        outputDataString = outputDataString.substring(0, outputDataString.length - 1); 
        outputDataString = `{${outputDataString}}`;
        outputDataString = JSON.parse(outputDataString);
        outputDataString = JSON.stringify(outputDataString, null, 3);

        let nomeDoArquivo = "caseTecnico4All";
        let blob = new Blob([outputDataString], {type: "text/plain;charset=utf-8"})
        saveAs(blob, nomeDoArquivo + ".json");
	
	})
	.fail(function(jqXHR, textStatus, msg){
		console.log('A requisição falhou e retornou com a seguinte mensagem: ' + msg);
	});
   
}

$(".botao-gerar-arquivo").on("click", gerarArquivoJson);
