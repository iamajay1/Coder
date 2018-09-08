var _ = require('lodash');
module.exports.cartSlot = function(cart){
  if(cart == "" || cart == undefined || cart == null){
    var obj = {
                items : {},
                totalQuantity : 0,
                totalPrice : 0,
                empty : true
              };
  }
  else{
    var obj = {
                items : cart.items,
                totalQuantity : cart.totalQuantity,
                totalPrice : cart.totalPrice,
                empty : false
              };
  }
  obj.empty = _.isEmpty(obj.items);

  return obj;
}//end of cartModel/

//adding product.
module.exports.addProduct = function(cart,product,x){
  if(!cart.items[x]){
    cart.items[x]={
                      item : product,
                      quantity : 0,
                      pPrice : 0
                   };
  }
  cart.items[x].quantity++;
  cart.items[x].pPrice = product.pPrice * cart.items[x].quantity;
  cart.totalQuantity++;
  cart.totalPrice += product.pPrice;
  cart.empty = _.isEmpty(cart.items);

  return cart;
}//end of addProduct.

//deleting product.
module.exports.deleteProduct = function(cart,x){
  if(cart.items[x]){
    cart.totalQuantity -= cart.items[x].quantity;
    cart.totalPrice -= cart.items[x].pPrice;
    delete cart.items[x];
    cart.empty = _.isEmpty(cart.items);

    return cart;
  }
}//end of deleteProduct.

//increase quantity by 1.
module.exports.addOne = function(cart,x){
  cart.items[x].quantity++;
  cart.items[x].pPrice = cart.items[x].item.pPrice * cart.items[x].quantity;
  cart.totalQuantity++;
  cart.totalPrice += cart.items[x].item.pPrice;
  cart.empty = _.isEmpty(cart.items);

  return cart;
}//end of addOne.

//decrease quantity by 1.
module.exports.deleteOne = function(cart,x){
  if(cart.items[x].quantity == 1){
    cart.totalQuantity--;
    cart.totalPrice -= cart.items[x].item.pPrice;
    delete cart.items[x];
    cart.empty = _.isEmpty(cart.items);
  }
  else{
    cart.items[x].quantity--;
    cart.items[x].pPrice = cart.items[x].item.pPrice * cart.items[x].quantity;
    cart.totalQuantity--;
    cart.totalPrice -= cart.items[x].item.pPrice;
    cart.empty = _.isEmpty(cart.items);
  }

  return cart;
}
