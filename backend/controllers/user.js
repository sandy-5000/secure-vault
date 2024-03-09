import user from "../models/user.js"
import file from "../models/file.js"

export default function UserController() {
    return {
        login: async function ({ email, passwd }) {
            try {
                const result = await user.findOne({ email, passwd })
                return result
            } catch (e) {
                return { ...e, errno: 404 }
            }
        },
        createUser: async function ({ email, name, passwd }) {
            try {
                const new_user = new user({ email, name, passwd })
                const result = await new_user.save()
                const root_dir = new file({
                    user_id: result._id,
                    group_id: result._id,
                    name: 'Home',
                    directory: true,
                    location: '/'
                })
                const root = await root_dir.save()
                await file.updateOne({
                    user_id: result._id,
                    group_id: result._id,
                }, { parent: root._id })
                return { result, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        },
        getfiles: async function ({ user_id, group_id, location }) {
            try {
                const result = await file.findOne({ user_id, group_id, location })
                return { result, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        },
        createFolder: async function ({ user_id, group_id, location, parent, folder_name, directory, link }) {
            try {
                const new_folder = new file({
                    user_id, group_id, folder_name,
                    parent, name: folder_name, directory: directory,
                    location: location + folder_name + '/',
                    link: link
                })
                let result = await new_folder.save()
                await file.updateOne({ user_id, group_id, _id: parent }, {
                    $push: {
                        children: { name: result.name, _id: result._id }
                    }
                })
                return { result, status: 200 }
            } catch (e) {
                return { result: e, status: 400 }
            }
        }
    }
}
