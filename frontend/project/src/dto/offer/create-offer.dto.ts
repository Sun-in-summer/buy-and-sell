enum OfferType {
  Buy = 'Buy',
  Sell = 'Sell',
}

export default class CreateOfferDto {

  public title!: string;


  public description!: string;


  public postDate!: string;


  public type!: OfferType;


  public price!: number;

  public categories!: string[];


  public image!: string;
}
