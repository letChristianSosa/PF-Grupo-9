const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
    sequelize.define('product', {
        model: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            validate: {
                between1And5(value){
                    if(parseInt(value) < 1 || parseInt(value) > 100000){
                        throw new Error("Only numbers between 1 and 100000 are allowed.")
                    }
                }
            },
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        sale: {
            type: DataTypes.INTEGER,
            validate: {
                between1And5(value){
                    if(parseInt(value) < 0 || parseInt(value) > 99){
                        throw new Error("Only numbers between 0 and 99 are allowed.")
                    }
                }
            },
            allowNull: false,
            defaultValue: 0,
        },
        size: {
            type: DataTypes.FLOAT,
            validate: {
                between1And5(value){
                    if(parseInt(value) < 3 || parseInt(value) > 50){
                        throw new Error("Only numbers between 3 and 50 are allowed.")
                    }
                }
            },
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            validate: {
                between1And5(value){
                    if(parseInt(value) < 0 || parseInt(value) > 100000){
                        throw new Error("Only numbers between 0 and 100.000 are allowed.")
                    }
                }
            },
            allowNull: false,
        },
        color: {
            type: DataTypes.ENUM("Black", "White", "Brown", "Red", "Blue", "Green", "Yellow", "Gray", "Beige", "Pink"),
            allowNull: false,
            
        },
        brand: {
            type: DataTypes.ENUM("Nike", "Adidas", "Jordan", "Puma", "New Balance", "Reebok", "Converse"),
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM("Female", "Male", "Unisex"),
            allowNull: false,
        },
        category: {
            type: DataTypes.ENUM("Urban", "Football", "Elegant", "Running", "Training"),
            allowNull: false,
        },
    });
};









