import {Sequelize, DataTypes, Model} from "sequelize";

( 
    async() => {
        const sequelize = new Sequelize('sqlite::memory:', {logging: console.log})
        const model = sequelize.define<Model<string, string>>('User', {
            firstname: {
                type: DataTypes.STRING,
                allowNull: false
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: false
            },
        })

        const user = new model()
    }
)()
