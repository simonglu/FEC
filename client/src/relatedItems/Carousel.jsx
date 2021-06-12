import React, {useState, useEffect} from 'react';
import RelatedCard from './RelatedCard.jsx';
import OutfitCard from './OutfitCard.jsx';
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from 'react-icons/Md';
import { FiPlusCircle } from 'react-icons/Fi';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';

const Carousel = ({ products, productId, setProductId, related }) => {
  const [current, setCurrent] = useState(0);
  const [length, setLength] = useState(0);
  const [scrollable, setScrollable] = useState({right: true, left: false});

  useEffect(() => {
    setLength(products.length);
    setCurrent(0);
  }, [products]);

  useEffect(() => {
    if (current + 3 >= length) {
      setScrollable({right: false, left: true});
    } else if (current === 0) {
      setScrollable({right: true, left: false});
    } else {
      setScrollable({right: true, left: true});
    }
  }, [current]);

  const nextCard = () => {
    setCurrent(current >= length - 1 ? length - 1 : current + 1);
  };

  const prevCard = () => {
    setCurrent(current <= 0 ? 0 : current - 1 );
  };

  const getDefaultStyle = (prod) => {
    prod.styles.results.forEach(style => {
      if (style['default?'] === true) {
        return style;
      }
    });
    return prod.styles.results[0];
  };

  const getStarRating = async (id) => {
    let averageRating = 0;
    await axios.get('/getAverageRating', { params: { productId: id } })
      .then((response) => {
        averageRating = response.data;
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
    return averageRating;
  };

  // const saveOutfit = (outfit) => {
  //   let allOutfits = {...outfits};
  //   allOutfits[outfit.overview.id] = outfit;
  //   setOutfits(allOutfits);
  //   window.localStorage.removeItem('myThreads');
  //   window.localStorage.setItem('myThreads', JSON.stringify(allOutfits));
  // };

  return (
    <section className='carousel'>
      {scrollable.left ?
        <MdKeyboardArrowLeft className='left-arrow' onClick={prevCard}/>
        : null
      }
      {scrollable.right ?
        <MdKeyboardArrowRight className='right-arrow' onClick={nextCard}/>
        : null
      }
      <div className='cards-container'>
        { length !== 0 && related ?
          products.map((product, index) => {
            return (
              index >= current || current + 2 >= length ?
                <RelatedCard
                  product={product}
                  key={product.overview.id}
                  productId={productId}
                  setProductId={setProductId}
                  getStarRating={getStarRating}
                  getDefaultStyle={getDefaultStyle}
                />
                : null
            );
          })
          : null
        }
        {!related ? <FiPlusCircle onClick={() => console.log('click')}/> : null}
        { length !== 0 && !related ?
          products.map((product, index) => {
            return (
              index >= current || current + 2 >= length ?
                <OutfitCard
                  outfit={product}
                  key={product.overview.id}
                  productId={productId}
                  setProductId={setProductId}
                  getStarRating={getStarRating}
                />
                : null
            );
          })
          : null
        }
      </div>
    </section>
  );
};

export default Carousel;