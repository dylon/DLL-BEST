/// Copyright (C) 2010 Dylon Edwards
/// 
/// This code is available under MIT License.
/// 
/// Permission is hereby granted, free of charge, to any person obtaining a copy
/// of this software and associated documentation files (the "Software"), to deal
/// in the Software without restriction, including without limitation the rights
/// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
/// copies of the Software, and to permit persons to whom the Software is
/// furnished to do so, subject to the following conditions:
/// 
/// The above copyright notice and this permission notice shall be included in
/// all copies or substantial portions of the Software.
/// 
/// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
/// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
/// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
/// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
/// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
/// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
/// THE SOFTWARE.

using System;

namespace DllBest {
	namespace Avl {

		/// <summary>
		/// A node for use within the DLL BEST tree </summary>
		public class Node<T> : DllBest.Node<T, Node<T>> {


			////////////////////////////////////////////////////////////////////////
			///                                                                  ///
			///                            Properties                            ///
			///                                                                  ///
			////////////////////////////////////////////////////////////////////////


			/// <summary>
			/// Whether this Node is a leaf node (i.e. it has no children)
			/// </summary>
			public bool IsLeaf {
				get {
					return (this.Height == 0);
				}
			}

			/// <summary>
			/// Whether this Node is a branch (i.e. it has exactly one child)
			/// </summary>
			public bool IsBranch {
				get {
					bool lc = (this.LChild != null);
					bool rc = (this.RChild != null);

					return ((lc && !rc) || (!lc && rc));
				}
			}

			/// <summary>
			/// The maximum height between this Node's children, or -1 if this is a
			/// leaf node. </summary>
			public int MaxChildHeight {
				get {
					int lHeight = (this.LChild != null) ? this.LChild.Height : -1,
						rHeight = (this.RChild != null) ? this.RChild.Height : -1;
					
					return (lHeight > rHeight) ? lHeight : rHeight;
				}
			}

			/// <summary>
			/// The balance of this Node, which is calculated as the difference
			/// between the heights of its left and right children. </summary>
			public int Balance {
				get {
					int lHeight = (this.LChild != null) ? this.LChild.Height : -1,
						rHeight = (this.RChild != null) ? this.RChild.Height : -1;

					return (lHeight - rHeight);
				}
			}

			/// <summary>
			/// Whether this Node is balanced </summary>
			public bool IsBalanced {
				get {
					int balance = this.Balance;
					return ((balance >= -1) && (balance <= 1));
				}
			}


			////////////////////////////////////////////////////////////////////////
			///                                                                  ///
			///                   DllBest.Avl.Node Constructor                   ///
			///                                                                  ///
			////////////////////////////////////////////////////////////////////////	


			/// <summary>
			/// Constructs a new DLL BEST Node </summary>
			///
			/// <param name="key">Value to assign this Node</param>
			public Node(T key)
				: base(key) {
			}

			/// <summary>
			/// Parameter-less constructor </summary>
			public Node()
				: this(default(T)) {
			}


			////////////////////////////////////////////////////////////////////////
			///                                                                  ///
			///                         Instance Methods                         ///
			///                                                                  ///
			////////////////////////////////////////////////////////////////////////


			/// <summary>
			/// Returns a string representation of this Node, suitable for printing
			/// </summary>
			///
			/// <returns> A string representation of this Node </returns>
			public override string ToString() {
				if (this.Key is object) {
					return "(" + this.Key.ToString() + ", " + this.Height + ")";
				}
				
				return "(" + this.Key + ", " + this.Height + ")";
			}
		}
	}
}

