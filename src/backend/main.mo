import Text "mo:base/Text";
import Array "mo:base/Array";

persistent actor {

  // ============ TYPES ============

  type Review = {
    reviewer: Text;
    rating: Float;
    comment: Text;
    date: Text;
  };

  type Product = {
    id: Text;
    name: Text;
    description: Text;
    shortDescription: Text;
    price: Float;
    discountPrice: ?Float;
    category: Text;
    image: Text;
    image2: Text;
    image3: Text;
    image4: Text;
    featured: Bool;
    newArrival: Bool;
    isBestSeller: Bool;
    sizes: [Text];
    colors: [Text];
    colorImages: [(Text, Text)];
    stock: Nat;
    fabric: Text;
    rating: Float;
    reviewCount: Nat;
    soldCount: Nat;
    deliveryThreshold: Nat;
    returnDays: Nat;
    reviews: [Review];
    keyHighlights: [Text];
    viewingCount: Nat;
    trendingBadge: Bool;
  };

  type OrderItem = {
    productName: Text;
    size: Text;
    qty: Nat;
    price: Float;
  };

  type Order = {
    id: Text;
    date: Text;
    customerName: Text;
    email: Text;
    phone: Text;
    address: Text;
    city: Text;
    postalCode: Text;
    paymentMethod: Text;
    items: [OrderItem];
    productTotal: Float;
    shippingFee: Float;
    grandTotal: Float;
    status: Text;
    discountCode: Text;
    discountAmount: Float;
  };

  type Settings = {
    storeName: Text;
    whatsappNumber: Text;
    easyPaisaNumber: Text;
    contactEmail: Text;
    deliveryFee: Float;
    freeShippingThreshold: Float;
    currency: Text;
    heroImage: Text;
    announcementCode: Text;
    popupCode: Text;
  };

  type Discount = {
    code: Text;
    percent: Float;
    active: Bool;
    usageCount: Nat;
  };

  type Contact = {
    id: Text;
    name: Text;
    email: Text;
    phone: Text;
    message: Text;
    date: Text;
  };

  type Subscriber = {
    id: Text;
    email: Text;
    whatsapp: Text;
    date: Text;
  };

  // ============ STATE ============

  var products : [Product] = [];
  var orders : [Order] = [];
  var discounts : [Discount] = [
    { code = "FIRST10"; percent = 10.0; active = true; usageCount = 0 },
    { code = "SUMMER26"; percent = 10.0; active = true; usageCount = 0 }
  ];
  var contacts : [Contact] = [];
  var subscribers : [Subscriber] = [];
  var settings : Settings = {
    storeName = "ThreadsHub";
    whatsappNumber = "03174933882";
    easyPaisaNumber = "03174933882";
    contactEmail = "mirzayasir592@gmail.com";
    deliveryFee = 150.0;
    freeShippingThreshold = 2000.0;
    currency = "PKR";
    heroImage = "";
    announcementCode = "FIRST10";
    popupCode = "SUMMER26";
  };
  var seeded : Bool = false;

  // ============ PRODUCTS ============

  public query func getProducts() : async [Product] {
    products
  };

  public func addProduct(p : Product) : async Text {
    products := Array.append(products, [p]);
    p.id
  };

  public func updateProduct(updated : Product) : async Bool {
    let found = Array.find(products, func(p : Product) : Bool { p.id == updated.id });
    switch (found) {
      case null { false };
      case (?_) {
        products := Array.map(products, func(p : Product) : Product {
          if (p.id == updated.id) updated else p
        });
        true
      };
    }
  };

  public func deleteProduct(id : Text) : async Bool {
    let before = products.size();
    products := Array.filter(products, func(p : Product) : Bool { p.id != id });
    products.size() < before
  };

  public func bulkImportProducts(newProducts : [Product]) : async Nat {
    products := Array.append(products, newProducts);
    newProducts.size()
  };

  public func seedProducts(seed : [Product]) : async () {
    if (not seeded and products.size() == 0) {
      products := seed;
      seeded := true;
    };
  };

  // ============ ORDERS ============

  public query func getOrders() : async [Order] {
    orders
  };

  public query func getOrderById(id : Text) : async ?Order {
    Array.find(orders, func(o : Order) : Bool {
      Text.toLowercase(o.id) == Text.toLowercase(id)
    })
  };

  public func addOrder(o : Order) : async Text {
    orders := Array.append(orders, [o]);
    o.id
  };

  public func updateOrderStatus(id : Text, status : Text) : async Bool {
    let found = Array.find(orders, func(o : Order) : Bool { o.id == id });
    switch (found) {
      case null { false };
      case (?_) {
        orders := Array.map(orders, func(o : Order) : Order {
          if (o.id == id) {
            { id = o.id; date = o.date; customerName = o.customerName;
              email = o.email; phone = o.phone; address = o.address;
              city = o.city; postalCode = o.postalCode;
              paymentMethod = o.paymentMethod; items = o.items;
              productTotal = o.productTotal; shippingFee = o.shippingFee;
              grandTotal = o.grandTotal; status = status;
              discountCode = o.discountCode; discountAmount = o.discountAmount }
          } else o
        });
        true
      };
    }
  };

  // ============ SETTINGS ============

  public query func getSettings() : async Settings {
    settings
  };

  public func saveSettings(s : Settings) : async Bool {
    settings := s;
    true
  };

  // ============ DISCOUNTS ============

  public query func getDiscounts() : async [Discount] {
    discounts
  };

  public func addDiscount(d : Discount) : async Bool {
    discounts := Array.append(discounts, [d]);
    true
  };

  public func updateDiscount(updated : Discount) : async Bool {
    let found = Array.find(discounts, func(d : Discount) : Bool { d.code == updated.code });
    switch (found) {
      case null { false };
      case (?_) {
        discounts := Array.map(discounts, func(d : Discount) : Discount {
          if (d.code == updated.code) updated else d
        });
        true
      };
    }
  };

  public func deleteDiscount(code : Text) : async Bool {
    let before = discounts.size();
    discounts := Array.filter(discounts, func(d : Discount) : Bool { d.code != code });
    discounts.size() < before
  };

  public query func validateDiscount(code : Text) : async ?Float {
    let found = Array.find(discounts, func(d : Discount) : Bool {
      d.code == code and d.active
    });
    switch (found) {
      case null { null };
      case (?d) { ?d.percent };
    }
  };

  // ============ CONTACTS ============

  public query func getContacts() : async [Contact] {
    contacts
  };

  public func addContact(c : Contact) : async Text {
    contacts := Array.append(contacts, [c]);
    c.id
  };

  public func deleteContact(id : Text) : async Bool {
    let before = contacts.size();
    contacts := Array.filter(contacts, func(c : Contact) : Bool { c.id != id });
    contacts.size() < before
  };

  // ============ SUBSCRIBERS ============

  public query func getSubscribers() : async [Subscriber] {
    subscribers
  };

  public func addSubscriber(s : Subscriber) : async Text {
    subscribers := Array.append(subscribers, [s]);
    s.id
  };

  public func deleteSubscriber(id : Text) : async Bool {
    let before = subscribers.size();
    subscribers := Array.filter(subscribers, func(s : Subscriber) : Bool { s.id != id });
    subscribers.size() < before
  };

};
