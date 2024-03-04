class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryOj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryOj[el]);

    let queryStr = JSON.stringify(queryOj);
    queryStr = queryStr.replace(/(gte|gt|lt|lre)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  fieldLimiting() {


    
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;

//Alternate

// const tours= await Tour
// .find()
// .where('duration')
// .equals(5);//     // build the query string
//     // Filtering
//     console.log(req.query);
//     const queryOj={...req.query}
//     const excludedFields=['page','sort','limit','fields'];
//     excludedFields.forEach(el=> delete(queryOj[el]));

//     // Advance Filtering

//    let queryStr=JSON.stringify(queryOj);
//    queryStr=queryStr.replace(/(gte|gt|lt|lre)\b/g,match=>`$${match}`);

//    let query= Tour.find(JSON.parse(queryStr));
//    //Sort

//       if(req.query.sort)
//       {
//         const sortBy=req.query.sort.split(',').join(' ');

//         query=query.sort(sortBy);
//       }
//       else
//       {
//         query=query.sort('-createdAt');
//       }

//      // FieldLimiting

//     if(req.query.fields){
//         const fields=req.query.fields.split(',').join(' ');

//      query=query.select(fields);
//     }
//     else{
//         query=query.select('-__v')
//     }

//     //Pagination

//         const page=req.query.page*1||1;
//         const limit=req.query.limit*1||100;
//         const skip=(page-1)*limit;
//     query=query.skip(skip).limit(limit);
//     if(req.query.page)
//     {
//         const noTours= await Tour.countDocuments();
//         if(skip>=noTours){
//          throw new err("Does Not Exist")
//         }

//     }
