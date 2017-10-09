
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

	this.addItem = function(productData) {
		console.log('AddItem:',productData);
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
				self.updateDom();
			}
		});

		return product;

	},


	this.getProductInCart = function(productId) {
		return this.cartList.querySelector('[data-product-id="'+productId+'"]');
	},

	this.removeItem = function(product) {
		this.parent.remove();
		this.updateDom();
	};

	this.countItems = function() {
		return document.querySelectorAll('.cart-list-container article.product:not(#dummy)').length;
	};

	this.updateDom = function() {
		var countItems = this.countItems();
		console.log(this.btnShoppingCartContainer);
		document.getElementById('cart-count').innerHTML = "("+countItems+")";

		if(countItems>0 && this.btnShoppingCartContainer.className.indexOf('active') === -1) {
			this.btnShoppingCartContainer.className += " active";
		}
		else if (countItems === 0) {
			this.btnShoppingCartContainer.className = this.btnShoppingCartContainer.className.replace(/active/g,"");
		}
		//update button quantity number.
		//Update total price
		//Show/Hide button "Open Cart"
	};

	this._toggleCartButton = function() {

	},

	this.init = function() {

	};
}

var cart = new ShoppingCart();

var products = document.querySelectorAll('.product-list > .product');


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
		//console.log("Click: ",productData);
	});
});