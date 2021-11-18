import React, { Component } from 'react';
import { getAllArticles, searchArticles } from '../services/ArticlesService';

export default class Front extends Component {

    constructor(props) {
        super(props)
        this.state = {
            articles: [],
            brands: [],
            searchBrands: [],
            genders: [],
            searchGender: 'todos',
            tags: [],
            searchTags: [],
            sending: true
        }
    }

    componentDidMount() {
        getAllArticles()
            .then(res => {
                const brands = res.map( elem => {
                    return elem.brand;
                })
                const uniqueBrands = this.getUniqueValues(brands);
                const genders = res.map( elem => {
                    return elem.gender;
                })
                const uniqueGenders = ['todos', ...this.getUniqueValues(genders)];
                const tags = res.map( elem => {
                    return elem.tags;
                })
                const flatTags = tags.flat();
                const uniqueTags = this.getUniqueValues(flatTags);
                this.setState({
                    articles: res,
                    brands: uniqueBrands,
                    genders: uniqueGenders,
                    tags: uniqueTags,
                    sending: false
                })
            })
    }

    getUniqueValues = (values) => {
        const uniqueValues = values.reduce((uniques, item) => {
            return uniques.includes(item) ? uniques : [...uniques, item]
        }, [])
        return uniqueValues;
    }

    articlesCards = () => {
        if (this.state.articles.length !== 0) {
            const cards = this.state.articles.map((article, index) => {
                return  <div className="card" key={index}>
                            <div className="header-card">
                                <h1>{article.brand}</h1>
                            </div>
                            <div className="body-card">
                                <p>{article.model}</p>
                                <p>{article.description}</p>
                                <img src={article.pic} />
                                <p>
                                    <span>{article.price} €</span>
                                    <span>{article.currentPrice} €</span>
                                </p>
                            </div>
                            <div className="footer-card">
                                <button>+ Info</button>
                            </div>
                        </div>
            })
            return cards;
        } else {
            return <p>No se han encontrado resultados para la búsqueda. Inténtelo de nuevo.</p>
        }
    }

    brandsForm = () => {
        const brandsCheckbox = this.state.brands.map((brand, index) => {
            return  <label key={index}>
                        <input type="checkbox" id={brand} onChange={this.onChangeBrands} />
                        {brand}
                    </label>
        })
        return brandsCheckbox;
    }

    gendersForm = () => {
        const gendersRadio = this.state.genders.map((gender, index) => {
            return  <label key={index}>
                        <input type="radio" id={gender} name="gender" onChange={this.onChangeGenders}/>
                        {gender}
                    </label>
        })
        return gendersRadio;
    }

    tagsForm = () => {
        const tagsCheckbox = this.state.tags.map((tag, index) => {
            return  <label key={index}>
                        <input type="checkbox" id={tag} onChange={this.onChangeTags} />
                        {tag}
                    </label>
        })
        return tagsCheckbox;
    }

    onChangeBrands = (event) => {
        let newArray;
        if(this.state.searchBrands.includes(event.target.id)) {
            newArray = this.state.searchBrands.filter(elem => elem !== event.target.id);
        } else {
            newArray = [...this.state.searchBrands, event.target.id];
        }
        this.setState({
            searchBrands: newArray,
            sending: true
        }, this.getSearchArticles)
    }

    onChangeGenders = (event) => {
        this.setState({
            searchGender: event.target.id,
            sending: true
        }, this.getSearchArticles)
    }

    onChangeTags = (event) => {
        let newArray;
        if(this.state.searchTags.includes(event.target.id)) {
            newArray = this.state.searchTags.filter(elem => elem !== event.target.id);
        } else {
            newArray = [...this.state.searchTags, event.target.id];
        }
        this.setState({
            searchTags: newArray,
            sending: true
        }, this.getSearchArticles)
    }

    getSearchArticles = () => {
        searchArticles(this.state.searchBrands, this.state.searchGender, this.state.searchTags)
            .then(res => {
                this.setState({
                    articles: res,
                    sending: false
                })
            });
    }

    render() {
        return (
            <div className="container">
                <aside>
                    {this.brandsForm()}
                    <hr />
                    {this.gendersForm()}
                    <hr />
                    {this.tagsForm()}
                </aside>
                <div className="row grid">
                    {
                        this.state.sending 
                        ?
                        <div className="spinner">
                            <div className="sk-chase">
                                <div className="sk-chase-dot"></div>
                                <div className="sk-chase-dot"></div>
                                <div className="sk-chase-dot"></div>
                                <div className="sk-chase-dot"></div>
                                <div className="sk-chase-dot"></div>
                                <div className="sk-chase-dot"></div>
                            </div>
                        </div>
                        :
                        this.articlesCards()
                    }
                </div>
            </div>
        )
    }
}
