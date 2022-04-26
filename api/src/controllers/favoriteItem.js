const { Op, Sequelize } = require("sequelize")
const { Product, Image, Stock, ShoppingCartItem, FavoriteItem } = require("../db.js")
const { sendError } = require("../helpers/error.js")
const { verifyToken } = require("../helpers/verify.js")

module.exports = {
  postFavoriteItem: async (req, res) => {
    try {
        const { productId, size } = req.body
        const decodedToken = await verifyToken(req, res)
        const userId = decodedToken.id
        const productSelected = await Product.findOne({
          where: { id: productId },
          include: { model: Stock, where: { size } },
        })
  
        if (productSelected?.stocks[0].amount > 0) {
          let [favoriteItem] = await FavoriteItem.findOrCreate({
            where: { productId, userId, size },
          })
  
        //   await cartItem.save()
  
          res.send(favoriteItem)
        } else {
          res.send({ Error: `The proctId (${productId}) or the size (${size}) where not found.` })
        }
      } catch (error) {
        sendError(res, error)
      }
  },

  getAllFavoriteItems: async (req, res) => {
    try {
      const decodedToken = await verifyToken(req, res)
      const sameUserFavorites = await FavoriteItem.findAll({
        where: {
          userId: decodedToken.id,
        },
        include: {
          model: Product,
          include: [
            { model: Image },
            { model: Stock },
          ],
        },
      })

      res.send(sameUserFavorites)
    } catch (error) {
      sendError(res, error)
    }
  },

  deleteOneFavoriteItem: async (req, res) => {
    try {
      const { id } = req.params
      await FavoriteItem.destroy({
        where: { id },
      })
      return res.send({ msg: "Favorite item deleted" })
    } catch (error) {
      sendError(res, error)
    }
  },

  deleteAllFavoriteItems: async (req, res) => {
    try {
      const decodedToken = await verifyToken(req, res)
      const userId = decodedToken.id
      await FavoriteItem.destroy({
        where: { userId },
      })
      res.send({ msg: "All Favorite Items removed" })
    } catch (error) {
      sendError(res, error)
    }
  },

}