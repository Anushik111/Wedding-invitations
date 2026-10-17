
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  description: string;
  badge?: string;
};

const products: Product[] = [
  { id: 1, name: "Կարմիր խնձոր", category: "Մրգեր", price: 650, unit: "կգ", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85", description: "Հյութալի ու խրթխրթան", badge: "Սիրված" },
  { id: 2, name: "Բանան", category: "Մրգեր", price: 850, unit: "կգ", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=85", description: "Քաղցր ու հասած" },
  { id: 3, name: "Նարինջ", category: "Մրգեր", price: 900, unit: "կգ", image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=85", description: "Թարմ ցիտրուսային միրգ" },
  { id: 4, name: "Ելակ", category: "Մրգեր", price: 2200, unit: "կգ", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=85", description: "Բուրավետ ու նուրբ" },
  { id: 5, name: "Լոլիկ", category: "Բանջարեղեն", price: 750, unit: "կգ", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85", description: "Թարմ՝ ամենօրյա սեղանի համար" },
  { id: 6, name: "Վարունգ", category: "Բանջարեղեն", price: 500, unit: "կգ", image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=900&q=85", description: "Թեթև ու խրթխրթան" },
  { id: 7, name: "Բուլղարական պղպեղ", category: "Բանջարեղեն", price: 1100, unit: "կգ", image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=900&q=85", description: "Գունեղ ու թարմ" },
  { id: 8, name: "Գազար", category: "Բանջարեղեն", price: 350, unit: "կգ", image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=900&q=85", description: "Բնական քաղցրությամբ" },
  { id: 9, name: "Նուշ", category: "Ընդեղեն", price: 4800, unit: "կգ", image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=900&q=85", description: "Ընտրովի որակի նուշ" },
  { id: 10, name: "Ընկույզ", category: "Ընդեղեն", price: 3200, unit: "կգ", image: "https://images.unsplash.com/photo-1563412885-139e4045b1f5?auto=format&fit=crop&w=900&q=85", description: "Հարուստ ու համեղ" },
  { id: 11, name: "Պիստակ", category: "Ընդեղեն", price: 6200, unit: "կգ", image: "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=900&q=85", description: "Համեղ նախուտեստ" },
  { id: 12, name: "Ծիրանի չիր", category: "Չրեր", price: 2800, unit: "կգ", image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=900&q=85", description: "Բնական քաղցրություն" },
  { id: 13, name: "Չամիչ", category: "Չրեր", price: 1700, unit: "կգ", image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=900&q=85", description: "Հարմար՝ խորտիկի համար" },
  { id: 14, name: "Խուրմա", category: "Չրեր", price: 2400, unit: "կգ", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=85", description: "Փափուկ ու քաղցր" },
];

const categories = ["Բոլորը", "Մրգեր", "Բանջարեղեն", "Ընդեղեն", "Չրեր"];
const money = (n: number) => `${n.toLocaleString("hy-AM")} ֏`;

export default function Home() {
  const [category, setCategory] = useState("Բոլորը");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("greenfarm-cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("greenfarm-cart", JSON.stringify(cart));
  }, [cart]);

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "Բոլորը" || p.category === category) &&
          p.name.toLocaleLowerCase("hy-AM").includes(
            search.toLocaleLowerCase("hy-AM")
          )
      ),
    [category, search]
  );

  const cartItems = products.filter((p) => (cart[p.id] || 0) > 0);
  const count = cartItems.reduce((sum, p) => sum + cart[p.id], 0);
  const total = cartItems.reduce(
    (sum, p) => sum + p.price * cart[p.id],
    0
  );

  function add(id: number) {
    setCart((old) => ({ ...old, [id]: (old[id] || 0) + 1 }));
  }

  function change(id: number, amount: number) {
    setCart((old) => {
      const next = { ...old };
      const value = (next[id] || 0) + amount;
      if (value <= 0) delete next[id];
      else next[id] = value;
      return next;
    });
  }

  function submitOrder(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Այստեղ գրիր խանութի WhatsApp համարը՝ առանց + նշանի։
    const WHATSAPP_NUMBER = "374XXXXXXXX";

    if (WHATSAPP_NUMBER.includes("X")) {
      alert(
        "Նախ app/page.tsx ֆայլում գրիր խանութի WhatsApp համարը։"
      );
      return;
    }

    const lines = cartItems.map(
      (p) =>
        `• ${p.name} — ${cart[p.id]} ${p.unit} × ${money(p.price)} = ${money(p.price * cart[p.id])}`
    );

    const message = [
      "Բարև GreenFarm, ցանկանում եմ պատվիրել։",
      "",
      ...lines,
      "",
      `Ընդհանուր՝ ${money(total)}`,
      "",
      `Անուն՝ ${customer.name}`,
      `Հեռախոս՝ ${customer.phone}`,
      `Հասցե՝ ${customer.address || "Խանութից վերցնել"}`,
      customer.note ? `Նշում՝ ${customer.note}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main>
      <div className="topbar">
        Թարմություն՝ ամեն օր
        <span>Բնական ընտրություն ձեր ընտանիքի համար</span>
      </div>

      <header className="header">
        <a className="brand" href="#" aria-label="GreenFarm գլխավոր էջ">
          <span className="brand-mark">🌿</span>
          <span>
            Green<span className="brand-light">Farm</span>
            <small>ԹԱՐՄՈՒԹՅՈՒՆ ԱՄԵՆ ՕՐ</small>
          </span>
        </a>

        <nav className="nav">
          <a href="#products">Տեսականի</a>
          <a href="#about">Մեր մասին</a>
          <a href="#contact">Կապ</a>
        </nav>

        <button className="cart-button" onClick={() => setCartOpen(true)}>
          Զամբյուղ <span>{count}</span>
        </button>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span /> ԹԱՐՄ • ԲՆԱԿԱՆ • ՀԱՄԵՂ
          </div>
          <h1>
            Բնության թարմությունը՝
            <br />
            <em>ձեր սեղանին</em>
          </h1>
          <p>
            Ընտրեք թարմ մրգեր, բանջարեղեն, որակյալ ընդեղեն ու
            համեղ չրեր՝ մեկ վայրում։
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#products">
              Գնել հիմա <span>↗</span>
            </a>
            <div className="fresh-note">✓ Ընտրված թարմ տեսականի</div>
          </div>
          <div className="hero-stats">
            <div><strong>4</strong><span>ապրանքային բաժին</span></div>
            <div><strong>100%</strong><span>համեղ ընտրություն</span></div>
            <div><strong>GreenFarm</strong><span>ձեր ամենօրյա շուկան</span></div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image" role="img" aria-label="Թարմ մթերքներ" />
          <div className="floating-card">
            <span className="floating-icon">🍎</span>
            <div>
              <strong>Թարմ ընտրություն</strong>
              <small>Ամեն օրվա համար</small>
            </div>
            <span className="check">✓</span>
          </div>
          <div className="leaf leaf-one">✦</div>
          <div className="leaf leaf-two">✧</div>
        </div>
      </section>

      <section className="benefits">
        <div><span>🍃</span><p><strong>Թարմ տեսականի</strong><small>Ամենօրյա ընտրություն</small></p></div>
        <div><span>🥕</span><p><strong>Բնական համ</strong><small>Բնությունից՝ ձեր սեղանին</small></p></div>
        <div><span>🛍️</span><p><strong>Հեշտ պատվեր</strong><small>Ընտրեք ու պատվիրեք</small></p></div>
        <div><span>💚</span><p><strong>Սիրով ընտրված</strong><small>Ձեր ընտանիքի համար</small></p></div>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span /> ՄԵՐ ՏԵՍԱԿԱՆԻՆ</div>
            <h2>Ընտրեք ձեր <em>սիրելիները</em></h2>
            <p>Թարմ մթերքներ՝ ամեն օրվա համեղ ընտրության համար։</p>
          </div>
          <label className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Որոնել ապրանք..."
              aria-label="Որոնել ապրանք"
            />
          </label>
        </div>

        <div className="category-row">
          {categories.map((c) => (
            <button
              key={c}
              className={category === c ? "category active" : "category"}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {visibleProducts.map((p) => (
            <article className="product-card" key={p.id}>
              <div className="product-image">
                <img src={p.image} alt={p.name} loading="lazy" />
                {p.badge && <span className="product-badge">{p.badge}</span>}
                <button
                  className="quick-add"
                  onClick={() => add(p.id)}
                  aria-label={`${p.name} ավելացնել զամբյուղում`}
                >
                  +
                </button>
              </div>
              <div className="product-info">
                <span className="product-category">{p.category}</span>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div className="product-bottom">
                  <strong>{money(p.price)} <small>/ {p.unit}</small></strong>
                  <button className="add-button" onClick={() => add(p.id)}>
                    Ավելացնել <span>+</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visibleProducts.length === 0 && (
          <div className="empty">Այս որոնմամբ ապրանք չգտնվեց։</div>
        )}
        <p className="price-note">
          Գները օրինակային են․ հրապարակելուց առաջ փոխարինեք իրական գներով։
        </p>
      </section>

      <section className="about-section" id="about">
        <div className="about-art">
          <div className="about-photo" />
          <div className="about-sticker">ԹԱՐՄ<br /><span>ԸՆՏՐՈՒԹՅՈՒՆ</span> ♡</div>
        </div>
        <div className="about-copy">
          <div className="eyebrow"><span /> GREENFARM-Ի ՄԱՍԻՆ</div>
          <h2>Լավ համը սկսվում է<br /><em>լավ ընտրությունից</em></h2>
          <p>
            GreenFarm-ում միավորել ենք մրգերի, բանջարեղենի,
            ընդեղենի և չրերի բազմազանությունը, որպեսզի ձեր
            գնումները լինեն պարզ ու հաճելի։
          </p>
          <a href="#products" className="text-link">
            Բացահայտել տեսականին <span>→</span>
          </a>
        </div>
      </section>

      <section className="cta-strip">
        <div>
          <span className="cta-icon">🥬</span>
          <div>
            <h2>Պատրա՞ստ եք ընտրել թարմը</h2>
            <p>Լրացրեք զամբյուղը և ուղարկեք ձեր պատվերը։</p>
          </div>
        </div>
        <a className="primary-button" href="#products">
          Դիտել ապրանքները <span>↗</span>
        </a>
      </section>

      <footer id="contact">
        <div className="footer-main">
          <a className="brand footer-brand" href="#">
            <span className="brand-mark">🌿</span>
            <span>Green<span className="brand-light">Farm</span><small>ԹԱՐՄՈՒԹՅՈՒՆ ԱՄԵՆ ՕՐ</small></span>
          </a>
          <p>Բնական համեր ու թարմ ընտրություն՝ ձեր ամեն օրվա համար։</p>
          <div className="footer-links">
            <a href="#products">Տեսականի</a>
            <a href="#about">Մեր մասին</a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer">Instagram ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GreenFarm։ Բոլոր իրավունքները պաշտպանված են։</span>
          <span>Ստեղծված է սիրով՝ 💚</span>
        </div>
      </footer>

      {cartOpen && (
        <div className="overlay" onMouseDown={(e) => {
          if (e.target === e.currentTarget) setCartOpen(false);
        }}>
          <aside className="drawer">
            <div className="drawer-heading">
              <div>
                <span className="eyebrow">ՁԵՐ ԸՆՏՐՈՒԹՅՈՒՆԸ</span>
                <h2>Զամբյուղ <span>({count})</span></h2>
              </div>
              <button className="close-button" onClick={() => setCartOpen(false)}>×</button>
            </div>

            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <span>🛍️</span>
                <h3>Զամբյուղը դեռ դատարկ է</h3>
                <p>Ավելացրեք ձեր նախընտրած ապրանքները։</p>
                <button className="primary-button" onClick={() => setCartOpen(false)}>
                  Դիտել տեսականին
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map((p) => (
                    <div className="cart-item" key={p.id}>
                      <img src={p.image} alt={p.name} />
                      <div className="cart-item-info">
                        <strong>{p.name}</strong>
                        <span>{money(p.price)} / {p.unit}</span>
                        <div className="quantity">
                          <button onClick={() => change(p.id, -1)}>−</button>
                          <span>{cart[p.id]}</span>
                          <button onClick={() => change(p.id, 1)}>+</button>
                        </div>
                      </div>
                      <b>{money(p.price * cart[p.id])}</b>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <span>Ընդհանուր գումար</span>
                  <strong>{money(total)}</strong>
                </div>
                <button className="primary-button full-button" onClick={() => {
                  setCartOpen(false);
                  setCheckoutOpen(true);
                }}>
                  Ձևակերպել պատվերը <span>→</span>
                </button>
                <button className="continue-button" onClick={() => setCartOpen(false)}>
                  Շարունակել գնումները
                </button>
              </>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="overlay" onMouseDown={(e) => {
          if (e.target === e.currentTarget) setCheckoutOpen(false);
        }}>
          <section className="checkout-modal">
            <div className="drawer-heading">
              <div>
                <span className="eyebrow">ՄԵԿ ՔԱՅԼ Է ՄՆԱՑԵԼ</span>
                <h2>Պատվերի տվյալները</h2>
              </div>
              <button className="close-button" onClick={() => setCheckoutOpen(false)}>×</button>
            </div>

            <p className="checkout-total">
              Պատվերի գումարը՝ <strong>{money(total)}</strong>
            </p>

            <form onSubmit={submitOrder}>
              <label>
                Անուն և ազգանուն
                <input required value={customer.name} onChange={(e) =>
                  setCustomer({ ...customer, name: e.target.value })
                } placeholder="Օր.՝ Անի Մանուկյան" />
              </label>
              <label>
                Հեռախոսահամար
                <input required type="tel" value={customer.phone} onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                } placeholder="+374 XX XXX XXX" />
              </label>
              <label>
                Առաքման հասցե (ըստ ցանկության)
                <input value={customer.address} onChange={(e) =>
                  setCustomer({ ...customer, address: e.target.value })
                } placeholder="Քաղաք, փողոց, շենք" />
              </label>
              <label>
                Լրացուցիչ նշում (ըստ ցանկության)
                <textarea value={customer.note} onChange={(e) =>
                  setCustomer({ ...customer, note: e.target.value })
                } placeholder="Նախընտրելի ժամ և այլ մանրամասներ" rows={3} />
              </label>
              <button className="primary-button full-button" type="submit">
                Ուղարկել պատվերը WhatsApp-ով <span>↗</span>
              </button>
              <p className="privacy-note">
                Կբացվի WhatsApp-ը՝ պատվերի պատրաստ հաղորդագրությամբ։
                Պատվերը վերջնական ուղարկելու համար հաստատեք այն WhatsApp-ում։
              </p>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
