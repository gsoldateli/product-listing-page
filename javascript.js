/**
Shopping cart

- Add Item
- Remove Item (When quantity 0)
- Count Items
- sumPrice
- hide/display show button.

**/

var product = {
	name:'',
	description:'',
	price:'',
	quantity:'',
	imgUrl:'',
	render:''
};


function ShoppingCart() {
	this.cartList = document.querySelector('.cart-list-container');
	this.dummyProduct = document.getElementById("dummy");
	this.btnShoppingCartContainer = document.getElementById("shopping-cart-menu");
	this.currentPromoCode;

	this.addItem = function(productData) {
		var productInCart = this.getProductInCart(productData.id);
		var qtd;
		
		if(productInCart) {
			qtd = productInCart.querySelector('.product__quantity > input').value;
			productInCart.querySelector('.product__quantity > input').value = parseInt(qtd) + 1; 
		}
		else {
			this.cartList.appendChild(this._cloneDummy(productData));	
		}

		this.updateDom();
		
	};

	this._cloneDummy = function(productData) {

		var product = this.dummyProduct.cloneNode(true);
		var self = this;

		var removeProduct = function(e) {
			e.preventDefault();
			this.parentNode.remove();
			self.updateDom();
		};


		product.removeAttribute('style');
		product.removeAttribute('id');
		product.setAttribute('data-product-id',productData.id);
		product.querySelector('.product__title').innerHTML = productData.name;
		product.querySelector('.product__description').innerHTML = productData.description;
		product.querySelector('.product__price').innerHTML = productData.price;
		product.querySelector('.product__image').style.backgroundImage = productData.imgUrl;
		product.querySelector('.product__remove').addEventListener('click', removeProduct);

		product.querySelector('.product__quantity > input').addEventListener("input",function(){
			if(parseInt(this.value) === 0) {
				this.parentNode.parentNode.remove();
			}
			self._updatePromoCodeDom(document.getElementById("promoCode"));
			self.updateDom();
		});

		return product;

	},


	this.getProductInCart = function(productId) {
		return this.cartList.querySelector('[data-product-id="'+productId+'"]');
	},

	this.getProductPrice = function(item) {
		return parseFloat(item.querySelector('.product__price').innerHTML.replace('$',''));
	};

	this.removeItem = function(product) {
		this.parent.remove();
		this.updateDom();
	};

	this.countItems = function() {
		var itensCount = 0;
		document.querySelectorAll('.cart-list-container article.product:not(#dummy)').forEach(function(item){
			itensCount += parseInt(item.querySelector('.product__quantity > input').value);
		});

		return itensCount;
	};

	this.updateDom = function() {
		var countItems = this.countItems();
		this._updateCartButton(countItems);
		this._updateCartPrice();
	};

	this.getPromoFunc = function(promoCode) {
		var func;
		var codes = [];
		var self = this;

		codes['ROLF10'] = function(item) {
			//if its Rolf, gives 10% discount.
			var price = self.getProductPrice(item);

			if(parseInt(item.getAttribute('data-product-id')) === 9) {
				price = price - (price * 0.1);
				self.__updateItemDiscountDom(price,item,true);		
			}
			else {
				self.__updateItemDiscountDom(price,item,false);
			}

			
			return price;
		};
		codes['BLACK15'] = function(item) {
			//All black fur dogs with 15% discount.
			var price = self.getProductPrice(item);
			//Atlas,Zeus,Snow
			if ([11,4,1].indexOf(parseInt(item.getAttribute('data-product-id'))) >= 0 ) {
				price = price - (price * 0.15);
				self.__updateItemDiscountDom(price,item,true);
			}
			else {
				self.__updateItemDiscountDom(price,item,false);
			}
			return price;
		};

		codes['ALL5'] = function(item) {
			//5% discount total order
			var price = self.getProductPrice(item);

			price = price - (price * 0.05);
			self.__updateItemDiscountDom(price,item,true);

			return price;
		};

		if(codes.indexOf(promoCode) >= 0) func = codes[promoCode];

		return codes[promoCode];


	},

	this.__updateItemDiscountDom = function(price,item,show) {
		var itemPrice = item.querySelector(".product__price");
		var itemDiscount = item.querySelector(".product__discount");

		if(show) {
			itemPrice.className += " discount ";
			itemDiscount.innerHTML = price.toFixed(2)+"$";				
		}
		else {
			itemPrice.className = itemPrice.className.replace(/ discount /g,'');
			itemDiscount.innerHTML = "";	
		}

	}

	this.applyPromoCode = function (promoCode) {
		promoCode = promoCode.toUpperCase();
		var currentValue = (this.currentPromoCode)? this.calcTotalPrice(this.currentPromoCode) : this.calcTotalPrice() ;
		var promoValue = 0;

		promoValue = this.calcTotalPrice(promoCode);

		if(promoValue < currentValue ) {
			this.currentPromoCode = promoCode;
		}

		this.updateDom();
	};

	this.calcTotalPrice = function(promoCode) {
		var total = 0;
		var promoFunction;
		var self = this;

		if(promoCode) {
			promoFunction = this.getPromoFunc(promoCode);	
		}

		console.log('promoFunction',promoFunction);
		
		this._getCartItems().forEach(function(item){
			var quantity = parseInt(item.querySelector('.product__quantity > input').value);
			var price = self.getProductPrice(item);
			
			if( promoFunction !== undefined ) {
				price = promoFunction(item);
			}

			total += (quantity * price);
		});

		return total.toFixed(2);
	};

	this._getCartItems = function() {
		return document.querySelectorAll('.cart-list-container article.product:not(#dummy)');
	}

	this._updateCartPrice = function() {
		this.cartList.querySelector(".total-price").innerHTML = this.calcTotalPrice(this.currentPromoCode) + "$";
	};

	this._updateCartButton = function(countItems) {
		if(countItems>0 && this.btnShoppingCartContainer.className.indexOf('active') === -1) {
			this.btnShoppingCartContainer.className += " active";
		}
		else if (countItems === 0) {
			this.btnShoppingCartContainer.className = this.btnShoppingCartContainer.className.replace(/active/g,"");
		}

		document.getElementById('cart-count').innerHTML = "("+countItems+")";
	};

	this.init = function() {
		this._registerAddToCartEvent();
		this._registerPromoCodeEvent();

		return this;
	};

	this._registerAddToCartEvent = function() {
		document.querySelectorAll('.product-list > .product').forEach(function(product){
			
			var productData = {
				id:product.getAttribute('data-product-id'),
				name: product.querySelector('.product__title').innerHTML,
				description: product.querySelector('.product__description').innerHTML,
				price: product.querySelector('.product__price').innerHTML,
				imgUrl: product.querySelector('.product__image').style.backgroundImage
			};
			
			product.addEventListener('click', function(e){
				e.preventDefault();
				cart.addItem(productData);
			});
		});		
	};

	this._registerPromoCodeEvent = function() {
		var self = this;
		document.getElementById("promoCode").addEventListener("input",function(){
			self._updatePromoCodeDom(this);
		});
	};

	this._updatePromoCodeDom = function(promoInput) {
		
			this.applyPromoCode(promoInput.value);
			console.log(promoInput.value, this.currentPromoCode);
			if(promoInput.value.toUpperCase() === this.currentPromoCode) {
				promoInput.className += " active ";
			}
			else {
				promoInput.className = promoInput.className.replace(/ active /g,"");
			}
		
	};
}

var cart = new ShoppingCart().init();




