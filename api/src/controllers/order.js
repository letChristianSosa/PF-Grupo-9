const { Order, ShoppingCartItem, User, Product, Image } = require("../db.js")
const { Op, Sequelize, where } = require("sequelize")
const moment = require("moment")
const { sendError } = require("../helpers/error.js")
const { verifyToken } = require("../helpers/verify.js")

const orderInclude = {
  include: [
    {
      model: ShoppingCartItem,
      include: { model: Product, include: { model: Image, limit: 1 } },
    },
    { model: User },
  ],
}

module.exports = {
  getOrders: async (req, res) => {
    const { email = "", delivered, order } = req.query
    try {
      if (order) {
        const orderById = await Order.findByPk(order, orderInclude)
        return res.send(orderById)
      }
      if (delivered) {
        console.log(delivered)
        const orderSearched = await Order.findAll({
          where: {
            [Op.or]: [
              Sequelize.where(
                Sequelize.cast(Sequelize.col("delivered"), "varchar"),
                {
                  [Op.iLike]: `%${delivered}%`,
                }
              ),
            ],
          },
          include: [
            {
              model: ShoppingCartItem,
              include: { model: Product, include: { model: Image, limit: 1 } },
            },
            { model: User, where: { email: { [Op.iLike]: `${email}%` } } },
          ],
        })
        return res.send(orderSearched)
      }
      if (email) {
        const orderSearchedEmail = await Order.findAll({
          include: [
            {
              model: ShoppingCartItem,
              include: { model: Product, include: { model: Image, limit: 1 } },
            },
            { model: User, where: { email: { [Op.iLike]: `${email}%` } } },
          ],
        })
        return res.send(orderSearchedEmail)
      }
      const allOrders = await Order.findAll(orderInclude)
      res.send(allOrders)
    } catch (error) {
      sendError(res, error)
    }
  },
  getOrdersUser: async (req, res) => {
    try {
      const decodedToken = await verifyToken(req, res)
      const userOrders = await Order.findAll({
        where: {
          userId: decodedToken.id,
        },
        orderInclude,
      })
      res.send(userOrders)
    } catch (error) {
      sendError(res, error)
    }
  },
  postOrder: async (req, res) => {
    try {
      const { telephoneNum, delivered, address, userId } = req.body // para qué pasa delivered?. No sería false por default?.
      const allShoppingCarts = await ShoppingCartItem.findAll({
        where: { userId, ordered: false },
        include: [{ model: Product, attributes: ["price"] }],
        //   [Sequelize.fn("SUM", Sequelize.col("Product.price")), "total"],
      })
      let total = 0
      allShoppingCarts.forEach((item) => {
        total += item.product.price
      })
      const owner = await User.findOne({ where: { id: userId } })
      const orderCreated = await Order.create({
        telephoneNum,
        delivered,
        address,
        total,
      })
      await orderCreated.addShoppingCartItems(allShoppingCarts)
      await orderCreated.setUser(owner)
      await ShoppingCartItem.update(
        { ordered: true },
        { where: { userId, ordered: false } }
      )
      return res.send({ msg: "Order created" })
    } catch (error) {
      sendError(res, error)
    }
  },

  putOrder: async (req, res) => {
    const { id } = req.params //debería recibir por query me parece..
    const { delivered } = req.body //
    try {
      const order = await Order.update(
        { delivered },
        {
          where: {
            id,
          },
        }
      )

      res.send({ msg: "Order updated" })
    } catch (error) {
      sendError(res, error)
    }
  },

  deleteOrder: async (req, res) => {
    const { id } = req.params //debería ser por query me parece.
    //deberíamos buscar todos los cartItems relacionados a esta order y pasarles el estado a ordered:false.
    try {
      await Order.destroy({
        where: { id },
      })
      res.send({ msg: "Order deleted" })
    } catch (error) {
      sendError(res, error)
    }
  },

  getLastSevenDaysOrders: async (req, res) => {
    try {
      const lastOrders = await Order.findAll({
        where: {
          createdAt: {
            [Op.gte]: moment().subtract(7, "days").toDate(),
          },
        },
        orderInclude,
      })
      res.send(lastOrders)
    } catch (error) {
      sendError(res, error)
    }
  },
  getTotalOrders: async (req, res) => {
    try {
      const totalOrders = await Order.findAll({
        attributes: ["id"],
        order: [["id", "DESC"]],
        limit: 1,
      })
      res.send(totalOrders)
    } catch (error) {
      sendError(res, error)
    }
  },
  getTotalGain: async (req, res) => {
    try {
      const totalGain = await Order.findAll({
        attributes: [
          [Sequelize.fn("SUM", Sequelize.col("total")), "totalGain"],
        ],
      })
      res.send(totalGain)
    } catch (error) {
      sendError(res, error)
    }
  },
}
